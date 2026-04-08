import { signUp, verifyOtp } from "@/api/authApi";
import Config from "@/components/common/Cofig";
import {
  LoginCard,
  LoginHeader,
  OtpVerification,
  SocialDivider,
  VerificationSuccess,
} from "@/features/auth/components";
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/features/auth/constants";
import { saveAuthTokens } from "@/features/auth/services/authStorage";
import {
  buttonStyles,
  buttonTheme,
  formStyles,
  linkStyles,
  loginPageStyles,
} from "@/features/auth/styles/login.styles";
import { useTranslation } from "@/hooks/useTranslation";
import { login as authSliceLogin } from "@/redux/reducers/authSlice";
import { setCookie } from "@/utils/utils";
import { useMutation as reactQueryUseMutation } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CreateAcc = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [step, setStep] = useState("signup"); // 'signup', 'otp', 'success'
  const [registeredUser, setRegisteredUser] = useState({ email: "", phone: "" });
  const otpType = router.query.type || "signup_otp";

  useEffect(() => {
    if (router.query.step === "otp" && router.query.email) {
      setRegisteredUser({ email: router.query.email, phone: router.query.phone || "" });
      setStep("otp");
    }
  }, [router.query]);

  const { mutate: mutateSignup, isLoading: signupLoading } =
    reactQueryUseMutation({
      mutationFn: signUp,
    });

  const { mutate: mutateVerifyOtp, isLoading: verifyLoading } =
    reactQueryUseMutation({
      mutationFn: (data) => verifyOtp(otpType, data),
    });

  const { mutate: mutateGoogle } = reactQueryUseMutation({
    mutationFn: signUp,
  });

  const onFinish = (formData) => {
    const userData = {
      email: formData?.email,
      name: `${formData?.firstName} ${formData?.lastName}`.trim(),
      password: formData?.password,
      phone: formData?.phone,
      firstName: formData?.firstName,
      lastName: formData?.lastName,
    };

    mutateSignup(userData, {
      onSuccess: (response) => {
        message.success(response?.data?.message || t("auth.accountCreated", { fallback: "Account created! Verification code sent." }));
        setRegisteredUser({ email: formData.email, phone: formData.phone || "" });
        setStep("otp");
      },
      onError: (error) => {
        message.error(
          error?.response?.data?.message || t("auth.failedToCreateAccount", { fallback: "Failed to create account." })
        );
      },
    });
  };

  const handleVerifyOtp = (otpValue) => {
    const verificationData = {
      email: registeredUser.email,
      phone: registeredUser.phone,
      otp: otpValue,
    };

    mutateVerifyOtp(verificationData, {
      onSuccess: (response) => {
        const isVerified = response?.data?.message === "OTP_VERIFIED" || response?.message === "OTP_VERIFIED";

        if (isVerified) {
          if (otpType === "login_otp" || response?.data?.access_token) {
            const tokens = {
              access_token: response?.data?.access_token,
              refresh_token: response?.data?.refresh_token,
            };
            saveAuthTokens(tokens, true);

            // Update Redux state immediately
            dispatch(authSliceLogin(response?.data));

            message.success(t("auth.loginSuccess", { fallback: "Login successful!" }));
            router.push("/");
            return;
          }

          setStep("success");
          setTimeout(() => {
            router.push("/login");
          }, 4000);
        } else {
          message.error(t("auth.otpVerificationFailed", { fallback: "OTP verification failed. Please try again." }));
        }
      },
      onError: (error) => {
        message.error(
          error?.response?.data?.message || t("auth.invalidOtp", { fallback: "Invalid OTP. Please try again." })
        );
      },
    });
  };

  const onGoogleRegister = (credentialResponse) => {
    const userGoogleData = {
      credential: credentialResponse?.credential,
      socialProvider: "google",
    };

    mutateGoogle(userGoogleData, {
      onSuccess: (response) => {
        message.success(t("auth.signupSuccessfully", { fallback: "Signup Successfully" }));
        setCookie("refresh_token", response?.data?.refresh_token);
        setCookie("access_token", response?.data?.access_token);
        router.push("/");
      },
      onError: (err) => {
        message.error(
          err?.response?.data?.message || t("auth.googleSignupFailed", { fallback: "Google signup failed." })
        );
      },
    });
  };

  const renderStepContent = () => {
    if (step === "otp") {
      return (
        <>
          <LoginHeader title= {t("auth.verifyYourAccount", { fallback: "Verify Your Account" })} />
          <OtpVerification
            email={registeredUser.email}
            phone={registeredUser.phone}
            onVerify={handleVerifyOtp}
            isLoading={verifyLoading}
            type={otpType}
          />
        </>
      );
    }

    if (step === "success") {
      return <VerificationSuccess />;
    }

    return (
      <>
        <LoginHeader title={t("auth.signUpToKlyra", { fallback: "Sign up to Klyra" })} />

        <Form
          name="signup"
          form={form}
          onFinish={onFinish}
          style={formStyles.form}
        >
          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("fields.firstName", { fallback: "First Name" })}</label>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: t("auth.enterFirstName", { fallback: "Please enter your first name" }) }]}
              style={formStyles.formItem}
            >
              <Input
                placeholder={t("auth.firstNamePlaceholder", { fallback: "First Name" })}
                style={formStyles.input}
                data-testid="signup-firstname"
              />
            </Form.Item>
          </div>

          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("fields.lastName", { fallback: "Last Name" })}</label>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: t("auth.enterLastName", { fallback: "Please enter your last name" }) }]}
              style={formStyles.formItem}
            >
              <Input
                placeholder={t("auth.lastNamePlaceholder", { fallback: "Last Name" })}
                style={formStyles.input}
                data-testid="signup-lastname"
              />
            </Form.Item>
          </div>

          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("auth.emailAddressLabel", { fallback: "Email Address" })}</label>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("auth.enterEmail", { fallback: "Please enter your email" }) },
                { type: "email", message: t("auth.enterValidEmail", { fallback: "Please enter a valid email" }) },
              ]}
              style={formStyles.formItem}
            >
              <Input
                placeholder={t("auth.enterYourEmailPlaceholder", { fallback: "Enter Your Email" })}
                style={formStyles.input}
                data-testid="signup-email"
              />
            </Form.Item>
          </div>

          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("auth.phoneNumberOptional", { fallback: "Phone Number (Optional)" })}</label>
            <Form.Item
              name="phone"
              style={formStyles.formItem}
            >
              <Input
                placeholder={t("auth.phoneNumberPlaceholder", { fallback: "Enter Your Phone Number" })}
                style={formStyles.input}
                data-testid="signup-phone"
              />
            </Form.Item>
          </div>

          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("auth.createPassword", { fallback: "Create Password" })}</label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: t("auth.enterPassword", { fallback: "Please create a password" }) },
                {
                  pattern: PASSWORD_REGEX,
                  message: PASSWORD_VALIDATION_MESSAGE,
                },
              ]}
              style={formStyles.formItem}
            >
              <Input.Password placeholder="xxxxxxxxx" style={formStyles.input} />
            </Form.Item>
          </div>

          <div style={formStyles.fieldContainer}>
            <label style={formStyles.label}>{t("auth.confirmPassword", { fallback: "Confirm Password" })}</label>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: t("auth.pleaseConfirmPassword", { fallback: "Please confirm your password" }) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("auth.passwordsDoNotMatch", { fallback: "The two passwords that you entered do not match!" })));
                  },
                }),
              ]}
              style={formStyles.formItem}
            >
              <Input.Password placeholder="xxxxxxxxx" style={formStyles.input} />
            </Form.Item>
          </div>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("Please accept the terms")),
              },
            ]}
            style={{ marginBottom: "24px" }}
          >
            <Checkbox style={{ fontSize: "14px" }}>
              <span style={{ color: "#1a1a1a", fontSize: "14px" }}>
                {t("auth.agreeToThe", { fallback: "Agree to the " })}
                <a href="https://www.klyra.no/avtalevilkar" target="_blank" rel="noopener noreferrer" style={{ color: "#0d7377", fontWeight: "500" }}>
                  {t("auth.terms", { fallback: "Terms" })}
                </a>
                {t("auth.and", { fallback: " and " })}
                <a href="https://www.klyra.no/avtalevilkar" target="_blank" rel="noopener noreferrer" style={{ color: "#0d7377", fontWeight: "500" }}>
                  {t("auth.privacyPolicy", { fallback: "Privacy Policy" })}
                </a>
                .
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item style={formStyles.buttonFormItem}>
            <Config theme={buttonTheme}>
              <Button
                style={buttonStyles.loginButton}
                type="primary"
                htmlType="submit"
                loading={signupLoading}
                data-testid="signup-button"
              >
                {t("auth.signup", { fallback: "Sign up" })}
              </Button>
            </Config>
          </Form.Item>

          <SocialDivider />

          <div style={linkStyles.registerContainer}>
            <span style={linkStyles.registerLink}>{t("auth.alreadyHaveAnAccount", { fallback: "Already have an account? " })}</span>
            <Link href="/login" style={linkStyles.registerLinkBold}>
              {t("auth.login", { fallback: "Login" })}
            </Link>
          </div>
        </Form>
      </>
    );
  };

  return (
    <div style={loginPageStyles.pageContainer}>
      <LoginCard>
        {renderStepContent()}
      </LoginCard>
    </div>
  );
};

export default CreateAcc;

CreateAcc.getLayout = function (page) {
  return <>{page}</>;
};
