/**
 * EditProfileModal Component
 * Modal for editing user profile information
 */

import styles from '@/styles/profile/EditProfileModal.module.css';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';

const EditProfileModal = ({ visible, onClose, onSave, initialValues, isSaving }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = (values) => {
    onSave(values);
  };

  return (
    <Modal
      title={<span className={styles.modalTitle}>Manage Profile</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className={styles.profileModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.profileForm}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label={<span className={styles.inputLabel}>First Name</span>}
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder="First Name" className={styles.profileInput} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label={<span className={styles.inputLabel}>Last Name</span>}
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder="Last Name" className={styles.profileInput} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="email"
              label={<span className={styles.inputLabel}>Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Email Address" className={styles.profileInput} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={<span className={styles.inputLabel}>Phone No.</span>}
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="Phone No." className={styles.profileInput} />
            </Form.Item>
          </Col>
        </Row>

        <div className={styles.formActions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.saveButton}
            loading={isSaving}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
