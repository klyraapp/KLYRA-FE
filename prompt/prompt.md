# Accept a Klarna payment

Learn how to accept Klarna, a global buy now, pay later payment method.

With [Klarna](https://docs.stripe.com/payments/klarna.md), customers are redirected to their Klarna account during checkout. If you don’t already have an integration with Stripe, we recommend using Stripe Checkout to [create a Stripe-hosted checkout page](https://docs.stripe.com/checkout/quickstart.md) and [configure payment methods in the Dashboard](https://docs.stripe.com/payments/dashboard-payment-methods.md).

You can also use [Elements with the Checkout Sessions API](https://docs.stripe.com/payments/quickstart-checkout-sessions.md) to build a customized checkout page on your website or build a mobile integration to authenticate the payment in a webview.

> Before you start the integration, make sure your account is eligible for Klarna by going to your [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods).

# Checkout

> This is a Checkout for when payment-ui is checkout. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=checkout.

## Manually listing payment methods

We recommend using [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md), where Stripe handles the logic for dynamically displaying the most relevant eligible payment methods to each customer to maximize conversion. If you choose to [manually list payment methods](https://docs.stripe.com/payments/payment-methods/integration-options.md#listing-payment-methods-manually), specify `klarna` in the [payment_method_types](https://docs.stripe.com/api/checkout/sessions/create.md#create_checkout_session-payment_method_types) when you create a [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) to include Klarna on your checkout page. If you have `line_items` in different currencies, you need to create separate Checkout Sessions.

#### Stripe-hosted page

```curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=T-shirt" \
  -d "line_items[0][price_data][unit_amount]=1099" \
  -d "line_items[0][quantity]=1" \
  -d mode=payment \
  -d "payment_method_types[0]=card" \
  -d "payment_method_types[1]=klarna" \
  --data-urlencode "success_url=https://example.com/success"
```

#### Embedded form

```curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=T-shirt" \
  -d "line_items[0][price_data][unit_amount]=1099" \
  -d "line_items[0][quantity]=1" \
  -d mode=payment \
  -d "payment_method_types[0]=card" \
  -d "payment_method_types[1]=klarna" \
  --data-urlencode "return_url=https://example.com/return" \
  -d ui_mode=embedded_page
```

## Test your integration 

When testing your Checkout integration, select Klarna as the payment method and click the **Pay** button. In testing environments, you can then simulate different outcomes within Klarna’s redirect.

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

For production testing, you can use an amount of `3500` in your local currency to test all Klarna payment options besides Financing. For example, if you want to test “Pay in 3” in Italy, you can use a transaction of 35.00 EUR.

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |


# Elements

> This is a Elements for when payment-ui is elements. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=elements.

## Manually listing payment methods

We recommend using [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md), where Stripe handles the logic for dynamically displaying the most relevant eligible payment methods to each customer to maximize conversion. If you choose to [manually list payment methods](https://docs.stripe.com/payments/payment-methods/integration-options.md#listing-payment-methods-manually), specify `klarna` in the [payment_method_types](https://docs.stripe.com/api/checkout/sessions/create.md#create_checkout_session-payment_method_types) when you create a [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) to include Klarna on your checkout page. If you have `line_items` in different currencies, you need to create separate Checkout Sessions.

```curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=T-shirt" \
  -d "line_items[0][price_data][unit_amount]=1099" \
  -d "line_items[0][quantity]=1" \
  -d mode=payment \
  -d "payment_method_types[0]=card" \
  -d "payment_method_types[1]=klarna" \
  --data-urlencode "return_url=https://example.com/return" \
  -d ui_mode=elements
```

## Test your integration 

When testing your Checkout integration, select Klarna as the payment method and click the **Pay** button. In testing environments, you can then simulate different outcomes within Klarna’s redirect.

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

For production testing, you can use an amount of `3500` in your local currency to test all Klarna payment options besides Financing. For example, if you want to test “Pay in 3” in Italy, you can use a transaction of 35.00 EUR.

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |


# iOS

> This is a iOS for when payment-ui is mobile and platform is ios. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=mobile&platform=ios.

Accepting Klarna in your app consists of displaying a webview for a customer to authenticate their payment. The customer then returns to your app, and you can immediately *confirm* (Confirming an intent indicates that the customer intends to use the current or provided payment method. Upon confirmation, the intent attempts to initiate the portions of the flow that have real-world side effects) whether the payment succeeded or failed.

## Set up Stripe [Server-side] [Client-side]

First, you need a Stripe account. [Register now](https://dashboard.stripe.com/register).

### Server-side 

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

### Client-side 

The [Stripe iOS SDK](https://github.com/stripe/stripe-ios) is open source, [fully documented](https://stripe.dev/stripe-ios/index.html), and compatible with apps supporting iOS 13 or above.

#### Swift Package Manager

To install the SDK, follow these steps:

1. In Xcode, select **File** > **Add Package Dependencies…** and enter `https://github.com/stripe/stripe-ios-spm` as the repository URL.
1. Select the latest version number from our [releases page](https://github.com/stripe/stripe-ios/releases).
1. Add the **StripePaymentsUI** product to the [target of your app](https://developer.apple.com/documentation/swift_packages/adding_package_dependencies_to_your_app).

#### CocoaPods

1. If you haven’t already, install the latest version of [CocoaPods](https://guides.cocoapods.org/using/getting-started.html).
1. If you don’t have an existing [Podfile](https://guides.cocoapods.org/syntax/podfile.html), run the following command to create one:
   ```bash
   pod init
   ```
1. Add this line to your `Podfile`:
   ```podfile
   pod 'StripePaymentsUI'
   ```
1. Run the following command:
   ```bash
   pod install
   ```
1. Don’t forget to use the `.xcworkspace` file to open your project in Xcode, instead of the `.xcodeproj` file, from here on out.
1. In the future, to update to the latest version of the SDK, run:
   ```bash
   pod update StripePaymentsUI
   ```

#### Carthage

1. If you haven’t already, install the latest version of [Carthage](https://github.com/Carthage/Carthage#installing-carthage).
1. Add this line to your `Cartfile`:
   ```cartfile
   github "stripe/stripe-ios"
   ```
1. Follow the [Carthage installation instructions](https://github.com/Carthage/Carthage#if-youre-building-for-ios-tvos-or-watchos). Make sure to embed all of the required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentsUI/README.md#manual-linking).
1. In the future, to update to the latest version of the SDK, run the following command:
   ```bash
   carthage update stripe-ios --platform ios
   ```

#### Manual Framework

1. Head to our [GitHub releases page](https://github.com/stripe/stripe-ios/releases/latest) and download and unzip **Stripe.xcframework.zip**.
1. Drag **StripePaymentsUI.xcframework** to the **Embedded Binaries** section of the **General** settings in your Xcode project. Make sure to select **Copy items if needed**.
1. Repeat step 2 for all required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentsUI/README.md#manual-linking).
1. In the future, to update to the latest version of our SDK, repeat steps 1–3.

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-ios/releases) page on GitHub. To receive notifications when a new release is published, [watch releases](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository) for the repository.

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/test/apikeys) on app start. This enables your app to make requests to the Stripe API.

#### Swift

```swift
import UIKitimportStripePaymentsUI

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {StripeAPI.defaultPublishableKey = "<<YOUR_PUBLISHABLE_KEY>>"
        // do any other necessary launch configuration
        return true
    }
}
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a PaymentIntent [Server-side] [Client-side]

A [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) is an object that represents your intent to collect payment from a customer and tracks the lifecycle of the payment process through each stage.

### Server-side 

First, create a `PaymentIntent` on your server and specify the amount to collect and the currency. If you already have an integration using the [Payment Intents API](https://docs.stripe.com/payments/payment-intents.md), add `klarna` to the list of [payment method types](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-payment_method_types) for your `PaymentIntent`.

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "payment_method_types[]=klarna" \
  -d amount=1099 \
  -d currency=eur
```

### Client-side 

Included in the returned PaymentIntent is a *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)), that the client side can use to securely complete the payment process instead of passing the entire PaymentIntent object. On the client, request a PaymentIntent from your server and store its client secret.

#### Swift

```swift
import UIKit
import StripePaymentsUI

class CheckoutViewController: UIViewController {
  var paymentIntentClientSecret: String?

  func startCheckout() {
      // Request a PaymentIntent from your server and store its client secret
  }
}}
```

## Submit the payment to Stripe [Client-side]

Retrieve the client secret from the PaymentIntent you created in step 2 and call the [STPPaymentHandler confirmPayment:](https://stripe.dev/stripe-ios/stripe-payments/Classes/STPPaymentHandler.html#/c:@M@StripePayments@objc\(cs\)STPPaymentHandler\(im\)confirmPayment:withAuthenticationContext:completion:) method. This presents a webview where the customer can complete the payment, which initiates a call to the completion block with the result of the payment.

#### Swift

```swift
let paymentIntentParams = STPPaymentIntentParams(clientSecret: paymentIntentClientSecret)
paymentIntentParams.paymentMethodParams = klarnaParams
paymentIntentParams.shipping = shippingDetails

STPPaymentHandler.shared().confirmPayment(paymentIntentParams, with: self) { (handlerStatus, paymentIntent, error) in
    switch handlerStatus {
    case .succeeded:
        // Payment succeeded

    case .canceled:
        // Payment was canceled

    case .failed:
        // Payment failed

    @unknown default:
        fatalError()
    }
}
```

## Test Klarna integration

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |

## Optional: Separate authorization and capture

Klarna supports [separate authorization and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md). If there’s a delay between the payment and delivering the goods to your customer, authorize the payment first and capture it later. At the point of capture, Klarna sends a statement to the customer and initiates the due dates on any subsequent payments that they must make. **An authorized Klarna payment must be captured within 28 days of the authorization**. Otherwise, the authorization automatically cancels and you can no longer capture the payment.

1. Tell Stripe to authorize only

   To indicate that you want separate authorization and capture, set [capture_method](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-capture_method) to `manual` when creating the PaymentIntent. This parameter instructs Stripe to only authorize the amount on the customer’s Klarna account.

   ```curl
   curl https://api.stripe.com/v1/payment_intents \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d "payment_method_types[]=klarna" \
     -d amount=1099 \
     -d currency=eur \
     -d capture_method=manual
   ```

1. Capture the funds

   After the authorization succeeds, the PaymentIntent [status](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-status) transitions to `requires_capture`. To capture the authorized funds, make a PaymentIntent [capture](https://docs.stripe.com/api/payment_intents/capture.md) request. The total authorized amount is captured by default—you can’t capture more than this, but you can capture less.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/capture \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d amount_to_capture=750
   ```

1. (Optional) Cancel the authorization

   Klarna counts any authorized payments against the customer’s total purchasing power within Klarna. Make sure that you actively cancel any authorized payments that you can’t fulfill (for example, the goods can’t be shipped) as soon as this becomes apparent.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/cancel \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d cancellation_reason=abandoned
   ```

## Optional: Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the Dashboard, a custom *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests), or a partner solution to receive these events and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events also helps you accept more payment methods in the future. Learn about the [differences between all supported payment methods](https://stripe.com/payments/payment-methods-guide).

- **Handle events manually in the Dashboard**

  Use the Dashboard to [View your test payments in the Dashboard](https://dashboard.stripe.com/test/payments), send email receipts, handle payouts, or retry failed payments.

- **Build a custom webhook**

  [Build a custom webhook](https://docs.stripe.com/webhooks/handling-payment-events.md#build-your-own-webhook) handler to listen for events and build custom asynchronous payment flows. Test and debug your webhook integration locally with the Stripe CLI.

- **Integrate a prebuilt app**

  Handle common business events, such as [automation](https://stripe.partners/?f_category=automation) or [marketing and sales](https://stripe.partners/?f_category=marketing-and-sales), by integrating a partner application.

## Optional: Customize the Klarna payment page

- **Prefill the Klarna form** 

  When the customer chooses to pay Klarna with a deferred payment option (pay later, installments, and financing), Klarna collects enough information for risk assessment and approval. The type of information depends on the country of the customer. For most countries in Europe, it’s the full billing details and date of birth. You can pass this information through the API, and the form will be prefilled when your customer arrives on the page.

  ```curl
  curl https://api.stripe.com/v1/payment_intents \
    -u "<<YOUR_SECRET_KEY>>:" \
    -d "payment_method_types[]=klarna" \
    -d amount=1099 \
    -d currency=eur \
    -d confirm=true \
    --data-urlencode "return_url=https://example.com/checkout/complete" \
    -d "payment_method_data[type]=klarna" \
    --data-urlencode "payment_method_data[billing_details][email]=customer@example.com" \
    -d "payment_method_data[billing_details][name]=Jenny Rosen" \
    --data-urlencode "payment_method_data[billing_details][phone]=+4915142321555" \
    -d "payment_method_data[billing_details][address][line1]=Alexanderplatz 1" \
    -d "payment_method_data[billing_details][address][city]=Berlin" \
    -d "payment_method_data[billing_details][address][postal_code]=10551" \
    -d "payment_method_data[billing_details][address][country]=DE" \
    -d "payment_method_data[klarna][dob][day]=10" \
    -d "payment_method_data[klarna][dob][month]=10" \
    -d "payment_method_data[klarna][dob][year]=1990"
  ```
![Screenshot of a Klarna payment page prefilled with billing details from the API and customized to render in English](https://b.stripecdn.com/docs-statics-srv/assets/klarna-kpp-prefilled-customized.75932cc9aa3223960aa2fcf769c1ce62.png)
  
  A Klarna payment page prefilled with billing details from the API and customized to render in English for a customer in Germany

## Optional: Add line items to the PaymentIntent

> #### Unified line items with Klarna
> 
> To optimize approval rates when you integrate with Klarna, include `line_items` data to represent what’s in a shopper’s cart. For early access, see [Payments line items](https://docs.stripe.com/payments/payment-line-items.md).

## Failed payments 

Klarna takes into account multiple factors when deciding to accept or decline a transaction (for example, length of time buyer has been using Klarna, outstanding amount customer has to repay, value of the current order).

When the customer selects a deferred payment method, Klarna performs a risk assessment before accepting the transaction. Klarna might decline the transaction due to unsatisfactory risk assessment result, the transaction amount involved, or the customer having a large outstanding debt. As such, we recommend that you present additional payment options such as `card` in your checkout flow. In these cases, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions to `requires_payment_method`.

Customers are expected to complete the payment within 48 hours after they’re redirected to the Klarna site. If no action is taken after 48 hours, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions from `requires_action` to `requires_payment_method`.

In these cases, inform your customer to try again with a different payment option presented in your checkout flow.

### Klarna rate limits

API requests to Klarna are subject to additional rate limits beyond Stripe’s [API-wide rate limits](https://docs.stripe.com/rate-limits.md). These limits can differ depending on the shape of the API requests that you make. In general, if you make more than 50 requests per second, you might see rate limiting in the form of responses with HTTP status code `400` or `402`. Contact us using the form at [Stripe support](https://support.stripe.com) if you’re concerned that your usage might reach these levels, because Klarna might be able to increase these limits on a case-by-case basis.

### Error messaging

Failed Klarna payments normally return one of the following failure codes. These codes show in the [last_payment_error](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-last_payment_error) API object.

> Before the `2023-08-16` API version, every Klarna error reported as [payment_intent_authentication_failure](https://docs.stripe.com/error-codes.md#payment_intent_authentication_failure). Make sure your API version is up to date to see the detailed errors listed below.

| Failure code                                                                                                            | Explanation                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [payment_method_customer_decline](https://docs.stripe.com/error-codes.md#payment-method-customer-decline)               | The customer canceled the checkout on Klarna’s page                                             |
| [payment_method_provider_decline](https://docs.stripe.com/error-codes.md#payment-method-provider-decline)               | Klarna declined the customer’s payment                                                          |
| [payment_intent_payment_attempt_expired](https://docs.stripe.com/error-codes.md#payment-intent-payment-attempt-expired) | The customer never completed the checkout on Klarna’s page, and the payment session has expired |
| [payment_method_not_available](https://docs.stripe.com/error-codes.md#payment-method-not-available)                     | An unexpected error occurred when trying to use Klarna                                          |


# Android

> This is a Android for when payment-ui is mobile and platform is android. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=mobile&platform=android.

Accepting Klarna in your app consists of displaying a webview for a customer to authenticate their payment. The customer then returns to your app, and you can immediately *confirm* (Confirming an intent indicates that the customer intends to use the current or provided payment method. Upon confirmation, the intent attempts to initiate the portions of the flow that have real-world side effects) whether the payment succeeded or failed.

## Set up Stripe [Server-side] [Client-side]

First, you need a Stripe account. [Register now](https://dashboard.stripe.com/register).

### Server-side 

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

### Client-side 

The [Stripe Android SDK](https://github.com/stripe/stripe-android) is open source and [fully documented](https://stripe.dev/stripe-android/).

To install the SDK, add `stripe-android` to the `dependencies` block of your [app/build.gradle](https://developer.android.com/studio/build/dependencies) file:

#### Kotlin

```kotlin
plugins {
    id("com.android.application")
}

android { ... }

dependencies {
  // ...

  // Stripe Android SDK
  implementation("com.stripe:stripe-android:23.5.0")
  // Include the financial connections SDK to support US bank account as a payment method
  implementation("com.stripe:financial-connections:23.5.0")
}
```

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/apikeys) so that it can make requests to the Stripe API, such as in your `Application` subclass:

#### Kotlin

```kotlin
import com.stripe.android.PaymentConfiguration

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        PaymentConfiguration.init(
            applicationContext,
            "<<YOUR_PUBLISHABLE_KEY>>"
        )
    }
}
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

Stripe samples also use [OkHttp](https://github.com/square/okhttp) and [GSON](https://github.com/google/gson) to make HTTP requests to a server.

## Create a PaymentIntent [Server-side] [Client-side]

A [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) is an object that represents your intent to collect payment from a customer and tracks the lifecycle of the payment process through each stage.

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "payment_method_types[]=klarna" \
  -d amount=1099 \
  -d currency=eur
```

### Client-side 

Included in the returned PaymentIntent is a *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)), which the client side can use to securely complete the payment process instead of passing the entire PaymentIntent object. On the client, request a PaymentIntent from your server and store its client secret.

#### Kotlin

```kotlin
class KlarnaPaymentActivity: AppCompatActivity() {
    private lateinit var paymentIntentClientSecret: String

    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        startCheckout()
    }


    private fun startCheckout() {
        // Request a PaymentIntent from your server and store its client secret
    }
}
```

## Submit the payment to Stripe [Client-side]

Retrieve the client secret from the PaymentIntent you created in step 2 and call the [PaymentLauncher confirm](https://stripe.dev/stripe-android/payments-core/com.stripe.android.payments.paymentlauncher/-payment-launcher/index.html#74063765%2FFunctions%2F-1622557690) method. This presents a webview where the customer can complete the payment. Afterwards, onActivityResult is called with the result of the payment.

#### Kotlin

```kotlin

class KlarnaPaymentActivity : AppCompatActivity() {
    // ...
    private lateinit var paymentIntentClientSecret: String
    private val paymentLauncher: PaymentLauncher by lazy {
        val paymentConfiguration = PaymentConfiguration.getInstance(applicationContext)
        PaymentLauncher.Companion.create(
            this,
            paymentConfiguration.publishableKey,
            paymentConfiguration.stripeAccountId,
            ::onPaymentResult
        )
    }

    private fun startCheckout() {
        // ...

        val confirmParams = ConfirmPaymentIntentParams
            .createWithPaymentMethodCreateParams(
                paymentMethodCreateParams = paymentMethodCreateParams,
                clientSecret = paymentIntentClientSecret,
                shipping = shippingDetails
            )
        paymentLauncher.confirm(confirmParams)
    }

    private fun onPaymentResult(paymentResult: PaymentResult) {
        when (paymentResult) {
            is PaymentResult.Completed -> {
                // show success UI
            }
            is PaymentResult.Canceled -> {
                // handle cancel flow
            }
            is PaymentResult.Failed -> {
                // handle failures
                // (for example, the customer may need to choose a new payment
                // method)
            }
        }
    }
}
```

## Test Klarna integration

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |

## Optional: Separate authorization and capture

Klarna supports [separate authorization and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md). If there’s a delay between the payment and delivering the goods to your customer, authorize the payment first and capture it later. At the point of capture, Klarna sends a statement to the customer and initiates the due dates on any subsequent payments that they must make. **An authorized Klarna payment must be captured within 28 days of the authorization**. Otherwise, the authorization automatically cancels and you can no longer capture the payment.

1. Tell Stripe to authorize only

   To indicate that you want separate authorization and capture, set [capture_method](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-capture_method) to `manual` when creating the PaymentIntent. This parameter instructs Stripe to only authorize the amount on the customer’s Klarna account.

   ```curl
   curl https://api.stripe.com/v1/payment_intents \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d "payment_method_types[]=klarna" \
     -d amount=1099 \
     -d currency=eur \
     -d capture_method=manual
   ```

1. Capture the funds

   After the authorization succeeds, the PaymentIntent [status](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-status) transitions to `requires_capture`. To capture the authorized funds, make a PaymentIntent [capture](https://docs.stripe.com/api/payment_intents/capture.md) request. The total authorized amount is captured by default—you can’t capture more than this, but you can capture less.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/capture \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d amount_to_capture=750
   ```

1. (Optional) Cancel the authorization

   Klarna counts any authorized payments against the customer’s total purchasing power within Klarna. Make sure that you actively cancel any authorized payments that you can’t fulfill (for example, the goods can’t be shipped) as soon as this becomes apparent.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/cancel \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d cancellation_reason=abandoned
   ```

## Optional: Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the Dashboard, a custom *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests), or a partner solution to receive these events and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events also helps you accept more payment methods in the future. Learn about the [differences between all supported payment methods](https://stripe.com/payments/payment-methods-guide).

- **Handle events manually in the Dashboard**

  Use the Dashboard to [View your test payments in the Dashboard](https://dashboard.stripe.com/test/payments), send email receipts, handle payouts, or retry failed payments.

- **Build a custom webhook**

  [Build a custom webhook](https://docs.stripe.com/webhooks/handling-payment-events.md#build-your-own-webhook) handler to listen for events and build custom asynchronous payment flows. Test and debug your webhook integration locally with the Stripe CLI.

- **Integrate a prebuilt app**

  Handle common business events, such as [automation](https://stripe.partners/?f_category=automation) or [marketing and sales](https://stripe.partners/?f_category=marketing-and-sales), by integrating a partner application.

## Optional: Customize the Klarna payment page

- **Prefill the Klarna form** 

  When the customer chooses to pay Klarna with a deferred payment option (pay later, installments, and financing), Klarna collects enough information for risk assessment and approval. The type of information depends on the country of the customer. For most countries in Europe, it’s the full billing details and date of birth. You can pass this information through the API, and the form will be prefilled when your customer arrives on the page.

  ```curl
  curl https://api.stripe.com/v1/payment_intents \
    -u "<<YOUR_SECRET_KEY>>:" \
    -d "payment_method_types[]=klarna" \
    -d amount=1099 \
    -d currency=eur \
    -d confirm=true \
    --data-urlencode "return_url=https://example.com/checkout/complete" \
    -d "payment_method_data[type]=klarna" \
    --data-urlencode "payment_method_data[billing_details][email]=customer@example.com" \
    -d "payment_method_data[billing_details][name]=Jenny Rosen" \
    --data-urlencode "payment_method_data[billing_details][phone]=+4915142321555" \
    -d "payment_method_data[billing_details][address][line1]=Alexanderplatz 1" \
    -d "payment_method_data[billing_details][address][city]=Berlin" \
    -d "payment_method_data[billing_details][address][postal_code]=10551" \
    -d "payment_method_data[billing_details][address][country]=DE" \
    -d "payment_method_data[klarna][dob][day]=10" \
    -d "payment_method_data[klarna][dob][month]=10" \
    -d "payment_method_data[klarna][dob][year]=1990"
  ```
![Screenshot of a Klarna payment page prefilled with billing details from the API and customized to render in English](https://b.stripecdn.com/docs-statics-srv/assets/klarna-kpp-prefilled-customized.75932cc9aa3223960aa2fcf769c1ce62.png)
  
  A Klarna payment page prefilled with billing details from the API and customized to render in English for a customer in Germany

## Optional: Add line items to the PaymentIntent

> #### Unified line items with Klarna
> 
> To optimize approval rates when you integrate with Klarna, include `line_items` data to represent what’s in a shopper’s cart. For early access, see [Payments line items](https://docs.stripe.com/payments/payment-line-items.md).

## Failed payments 

Klarna takes into account multiple factors when deciding to accept or decline a transaction (for example, length of time buyer has been using Klarna, outstanding amount customer has to repay, value of the current order).

When the customer selects a deferred payment method, Klarna performs a risk assessment before accepting the transaction. Klarna might decline the transaction due to unsatisfactory risk assessment result, the transaction amount involved, or the customer having a large outstanding debt. As such, we recommend that you present additional payment options such as `card` in your checkout flow. In these cases, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions to `requires_payment_method`.

Customers are expected to complete the payment within 48 hours after they’re redirected to the Klarna site. If no action is taken after 48 hours, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions from `requires_action` to `requires_payment_method`.

In these cases, inform your customer to try again with a different payment option presented in your checkout flow.

### Klarna rate limits

API requests to Klarna are subject to additional rate limits beyond Stripe’s [API-wide rate limits](https://docs.stripe.com/rate-limits.md). These limits can differ depending on the shape of the API requests that you make. In general, if you make more than 50 requests per second, you might see rate limiting in the form of responses with HTTP status code `400` or `402`. Contact us using the form at [Stripe support](https://support.stripe.com) if you’re concerned that your usage might reach these levels, because Klarna might be able to increase these limits on a case-by-case basis.

### Error messaging

Failed Klarna payments normally return one of the following failure codes. These codes show in the [last_payment_error](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-last_payment_error) API object.

> Before the `2023-08-16` API version, every Klarna error reported as [payment_intent_authentication_failure](https://docs.stripe.com/error-codes.md#payment_intent_authentication_failure). Make sure your API version is up to date to see the detailed errors listed below.

| Failure code                                                                                                            | Explanation                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [payment_method_customer_decline](https://docs.stripe.com/error-codes.md#payment-method-customer-decline)               | The customer canceled the checkout on Klarna’s page                                             |
| [payment_method_provider_decline](https://docs.stripe.com/error-codes.md#payment-method-provider-decline)               | Klarna declined the customer’s payment                                                          |
| [payment_intent_payment_attempt_expired](https://docs.stripe.com/error-codes.md#payment-intent-payment-attempt-expired) | The customer never completed the checkout on Klarna’s page, and the payment session has expired |
| [payment_method_not_available](https://docs.stripe.com/error-codes.md#payment-method-not-available)                     | An unexpected error occurred when trying to use Klarna                                          |


# React Native

> This is a React Native for when payment-ui is mobile and platform is react-native. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=mobile&platform=react-native.

Accepting Klarna in your app consists of displaying a webview for a customer to authenticate their payment. The customer then returns to your app, and you can immediately *confirm* (Confirming an intent indicates that the customer intends to use the current or provided payment method. Upon confirmation, the intent attempts to initiate the portions of the flow that have real-world side effects) whether the payment succeeded or failed.

## Set up Stripe [Server-side] [Client-side]

### Server-side 

This integration requires endpoints on your server that talk to the Stripe API. Use our official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

### Client-side 

The [React Native SDK](https://github.com/stripe/stripe-react-native) is open source and fully documented. Internally, it uses the [native iOS](https://github.com/stripe/stripe-ios) and [Android](https://github.com/stripe/stripe-android) SDKs. To install Stripe’s React Native SDK, run one of the following commands in your project’s directory (depending on which package manager you use):

#### yarn

```bash
yarn add @stripe/stripe-react-native
```

#### npm

```bash
npm install @stripe/stripe-react-native
```

Next, install some other necessary dependencies:

- For iOS, go to the **ios** directory and run `pod install` to ensure that you also install the required native dependencies.
- For Android, there are no more dependencies to install.

> We recommend following the [official TypeScript guide](https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project) to add TypeScript support.

### Stripe initialization

To initialize Stripe in your React Native app, either wrap your payment screen with the `StripeProvider` component, or use the `initStripe` initialization method. Only the API [publishable key](https://docs.stripe.com/keys.md#obtain-api-keys) in `publishableKey` is required. The following example shows how to initialize Stripe using the `StripeProvider` component.

```jsx
import { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      {/* Your app code here */}
    </StripeProvider>
  );
}
```

> Use your API [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a PaymentIntent [Server-side] [Client-side]

Stripe uses a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) object to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the payment process.

### Server-side 

First, create a `PaymentIntent` on your server and specify the amount to collect and the currency. If you already have an integration using the [Payment Intents API](https://docs.stripe.com/payments/payment-intents.md), add `klarna` to the list of [payment method types](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-payment_method_types) for your `PaymentIntent`.

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "payment_method_types[]=klarna" \
  -d amount=1099 \
  -d currency=eur
```

### Client-side 

A PaymentIntent includes a *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)). You can use the client secret in your React Native app to securely complete the payment process instead of passing back the entire PaymentIntent object. In your app, request a PaymentIntent from your server and store its client secret.

```javascript
function PaymentScreen() {
  // ...

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'eur',
      }),
    });
    const {clientSecret} = await response.json();

    return clientSecret;
  };

  return <View>...</View>;
}
```

## Submit the payment to Stripe [Client-side]

Submitting the payment to Stripe requires the client secret from the PaymentIntent that you created. Include it in your call to `confirmPayment`:

```javascript
import {Picker} from '@react-native-picker/picker';
import {confirmPayment} from '@stripe/stripe-react-native';

export default function MyPaymentScreen() {

  const handlePayPress = async () => {
    // Fetch the intent client secret from the backend.
    // See `fetchPaymentIntentClientSecret()`'s implementation above.
    const clientSecret = await fetchPaymentIntentClientSecret();

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Klarna'
      },
    });

    if (error) {
      console.log('Payment confirmation error', error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
    } else if (paymentIntent) {
      Alert.alert('Success', `The payment was confirmed successfully!`);
    }
  };
```

## Test Klarna integration

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |

## Optional: Separate authorization and capture

Klarna supports [separate authorization and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md). If there’s a delay between the payment and delivering the goods to your customer, authorize the payment first and capture it later. At the point of capture, Klarna sends a statement to the customer and initiates the due dates on any subsequent payments that they must make. **An authorized Klarna payment must be captured within 28 days of the authorization**. Otherwise, the authorization automatically cancels and you can no longer capture the payment.

1. Tell Stripe to authorize only

   To indicate that you want separate authorization and capture, set [capture_method](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-capture_method) to `manual` when creating the PaymentIntent. This parameter instructs Stripe to only authorize the amount on the customer’s Klarna account.

   ```curl
   curl https://api.stripe.com/v1/payment_intents \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d "payment_method_types[]=klarna" \
     -d amount=1099 \
     -d currency=eur \
     -d capture_method=manual
   ```

1. Capture the funds

   After the authorization succeeds, the PaymentIntent [status](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-status) transitions to `requires_capture`. To capture the authorized funds, make a PaymentIntent [capture](https://docs.stripe.com/api/payment_intents/capture.md) request. The total authorized amount is captured by default—you can’t capture more than this, but you can capture less.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/capture \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d amount_to_capture=750
   ```

1. (Optional) Cancel the authorization

   Klarna counts any authorized payments against the customer’s total purchasing power within Klarna. Make sure that you actively cancel any authorized payments that you can’t fulfill (for example, the goods can’t be shipped) as soon as this becomes apparent.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/cancel \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d cancellation_reason=abandoned
   ```

## Optional: Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the Dashboard, a custom *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests), or a partner solution to receive these events and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events also helps you accept more payment methods in the future. Learn about the [differences between all supported payment methods](https://stripe.com/payments/payment-methods-guide).

- **Handle events manually in the Dashboard**

  Use the Dashboard to [View your test payments in the Dashboard](https://dashboard.stripe.com/test/payments), send email receipts, handle payouts, or retry failed payments.

- **Build a custom webhook**

  [Build a custom webhook](https://docs.stripe.com/webhooks/handling-payment-events.md#build-your-own-webhook) handler to listen for events and build custom asynchronous payment flows. Test and debug your webhook integration locally with the Stripe CLI.

- **Integrate a prebuilt app**

  Handle common business events, such as [automation](https://stripe.partners/?f_category=automation) or [marketing and sales](https://stripe.partners/?f_category=marketing-and-sales), by integrating a partner application.

## Optional: Customize the Klarna payment page

- **Prefill the Klarna form** 

  When the customer chooses to pay Klarna with a deferred payment option (pay later, installments, and financing), Klarna collects enough information for risk assessment and approval. The type of information depends on the country of the customer. For most countries in Europe, it’s the full billing details and date of birth. You can pass this information through the API, and the form will be prefilled when your customer arrives on the page.

  ```curl
  curl https://api.stripe.com/v1/payment_intents \
    -u "<<YOUR_SECRET_KEY>>:" \
    -d "payment_method_types[]=klarna" \
    -d amount=1099 \
    -d currency=eur \
    -d confirm=true \
    --data-urlencode "return_url=https://example.com/checkout/complete" \
    -d "payment_method_data[type]=klarna" \
    --data-urlencode "payment_method_data[billing_details][email]=customer@example.com" \
    -d "payment_method_data[billing_details][name]=Jenny Rosen" \
    --data-urlencode "payment_method_data[billing_details][phone]=+4915142321555" \
    -d "payment_method_data[billing_details][address][line1]=Alexanderplatz 1" \
    -d "payment_method_data[billing_details][address][city]=Berlin" \
    -d "payment_method_data[billing_details][address][postal_code]=10551" \
    -d "payment_method_data[billing_details][address][country]=DE" \
    -d "payment_method_data[klarna][dob][day]=10" \
    -d "payment_method_data[klarna][dob][month]=10" \
    -d "payment_method_data[klarna][dob][year]=1990"
  ```
![Screenshot of a Klarna payment page prefilled with billing details from the API and customized to render in English](https://b.stripecdn.com/docs-statics-srv/assets/klarna-kpp-prefilled-customized.75932cc9aa3223960aa2fcf769c1ce62.png)
  
  A Klarna payment page prefilled with billing details from the API and customized to render in English for a customer in Germany

## Optional: Add line items to the PaymentIntent

> #### Unified line items with Klarna
> 
> To optimize approval rates when you integrate with Klarna, include `line_items` data to represent what’s in a shopper’s cart. For early access, see [Payments line items](https://docs.stripe.com/payments/payment-line-items.md).

## Failed payments 

Klarna takes into account multiple factors when deciding to accept or decline a transaction (for example, length of time buyer has been using Klarna, outstanding amount customer has to repay, value of the current order).

When the customer selects a deferred payment method, Klarna performs a risk assessment before accepting the transaction. Klarna might decline the transaction due to unsatisfactory risk assessment result, the transaction amount involved, or the customer having a large outstanding debt. As such, we recommend that you present additional payment options such as `card` in your checkout flow. In these cases, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions to `requires_payment_method`.

Customers are expected to complete the payment within 48 hours after they’re redirected to the Klarna site. If no action is taken after 48 hours, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions from `requires_action` to `requires_payment_method`.

In these cases, inform your customer to try again with a different payment option presented in your checkout flow.

### Klarna rate limits

API requests to Klarna are subject to additional rate limits beyond Stripe’s [API-wide rate limits](https://docs.stripe.com/rate-limits.md). These limits can differ depending on the shape of the API requests that you make. In general, if you make more than 50 requests per second, you might see rate limiting in the form of responses with HTTP status code `400` or `402`. Contact us using the form at [Stripe support](https://support.stripe.com) if you’re concerned that your usage might reach these levels, because Klarna might be able to increase these limits on a case-by-case basis.

### Error messaging

Failed Klarna payments normally return one of the following failure codes. These codes show in the [last_payment_error](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-last_payment_error) API object.

> Before the `2023-08-16` API version, every Klarna error reported as [payment_intent_authentication_failure](https://docs.stripe.com/error-codes.md#payment_intent_authentication_failure). Make sure your API version is up to date to see the detailed errors listed below.

| Failure code                                                                                                            | Explanation                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [payment_method_customer_decline](https://docs.stripe.com/error-codes.md#payment-method-customer-decline)               | The customer canceled the checkout on Klarna’s page                                             |
| [payment_method_provider_decline](https://docs.stripe.com/error-codes.md#payment-method-provider-decline)               | Klarna declined the customer’s payment                                                          |
| [payment_intent_payment_attempt_expired](https://docs.stripe.com/error-codes.md#payment-intent-payment-attempt-expired) | The customer never completed the checkout on Klarna’s page, and the payment session has expired |
| [payment_method_not_available](https://docs.stripe.com/error-codes.md#payment-method-not-available)                     | An unexpected error occurred when trying to use Klarna                                          |


# Direct API

> This is a Direct API for when payment-ui is direct-api. View the full page at https://docs.stripe.com/payments/klarna/accept-a-payment?payment-ui=direct-api.

## Manually listing payment methods

We recommend using [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md), where Stripe handles the logic for dynamically displaying the most relevant eligible payment methods to each customer to maximize conversion. If you choose to [manually list payment methods](https://docs.stripe.com/payments/payment-methods/integration-options.md#listing-payment-methods-manually), specify `klarna` in the [payment_method_types](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-payment_method_types) list when you create a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md).

### Create a PaymentIntent 

To help maximize acceptance rates and reduce disputes, pass in the following parameters when you [create a PaymentIntent](https://docs.stripe.com/api/payment_intents/create.md) for Klarna payments:

- [shipping](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-shipping): Ensure that these fields are defined and not empty: `name`, `address.line1`, `city`, `country`, and `postal_code`.
- [amount_details.line_items](https://docs.stripe.com/payments/payment-line-items.md)
- [payment_method_data.billing_details](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-payment_method_data-billing_details): Ensure these fields are defined and not empty: `name`, `address.line1`, `city`, `country`, and `postal_code`.

> When you set the [setup_future_usage](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-setup_future_usage) parameter, the payment isn’t considered a one-time payment. This impacts the [payment options available](https://docs.stripe.com/payments/klarna.md#payment-options) and prevents the [Payment Method Messaging Element](https://docs.stripe.com/elements/payment-method-messaging.md) and [Payment Element](https://docs.stripe.com/payments/payment-element.md) from displaying payment plans that a customer is eligible for.

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "payment_method_types[0]=klarna" \
  -d amount=1099 \
  -d currency=eur \
  -d "amount_details[line_items][0][product_name]=Your product name" \
  -d "amount_details[line_items][0][unit_cost]=1099" \
  -d "amount_details[line_items][0][quantity]=1" \
  -d "shipping[address][city]=Brothers" \
  -d "shipping[address][country]=US" \
  -d "shipping[address][line1]=27 Fredrick Ave" \
  -d "shipping[address][postal_code]=97712" \
  -d "shipping[address][state]=OR" \
  -d "payment_method_data[billing_details][address][city]=Brothers" \
  -d "payment_method_data[billing_details][address][country]=US" \
  -d "payment_method_data[billing_details][address][line1]=27 Fredrick Ave" \
  -d "payment_method_data[billing_details][address][postal_code]=97712" \
  -d "payment_method_data[billing_details][address][state]=OR" \
  --data-urlencode "payment_method_data[billing_details][email]=jenny.rosen@example.com" \
  -d "payment_method_data[billing_details][name]=Jenny Rosen"
```

### Retrieve the client secret

The PaymentIntent includes a *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)) that the client side uses to securely complete the payment process. You can use different approaches to pass the client secret to the client side.

#### Single-page application

Retrieve the client secret from an endpoint on your server, using the browser’s `fetch` function. This approach is best if your client side is a single-page application, particularly one built with a modern frontend framework like React. Create the server endpoint that serves the client secret:

#### Ruby

```ruby
get '/secret' do
  intent = # ... Create or retrieve the PaymentIntent
  {client_secret: intent.client_secret}.to_json
end
```

And then fetch the client secret with JavaScript on the client side:

```javascript
(async () => {
  const response = await fetch('/secret');
  const {client_secret: clientSecret} = await response.json();
  // Render the form using the clientSecret
})();
```

#### Server-side rendering

Pass the client secret to the client from your server. This approach works best if your application generates static content on the server before sending it to the browser.

Add the [client_secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) in your checkout form. In your server-side code, retrieve the client secret from the PaymentIntent:

#### Ruby

```erb
<form id="payment-form" data-secret="<%= @intent.client_secret %>">
  <button id="submit">Submit</button>
</form>
```

```ruby
get '/checkout' do
  @intent = # ... Fetch or create the PaymentIntent
  erb :checkout
end
```

## Submit the payment to Stripe 

In this step, you’ll complete Klarna payments on the client with [Stripe.js](https://docs.stripe.com/payments/elements.md).

### Set up Stripe.js

When a customer clicks to pay with Klarna, we recommend using Stripe.js to submit the payment to Stripe. Stripe.js is our foundational JavaScript library for building payment flows. It automatically handles complexities like the redirect described below, and enables you to easily extend your integration to other payment methods in the future. Include the Stripe.js script on your checkout page by adding it to the head of your HTML file.

```html
<head>
  <title>Checkout</title>
  <script src="https://js.stripe.com/dahlia/stripe.js"></script>
</head>
```

Create an instance of Stripe.js with the following JavaScript on your checkout page.

```javascript
// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
var stripe = Stripe('<<YOUR_PUBLISHABLE_KEY>>');
```

Rather than sending the entire PaymentIntent object to the client, use its [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret). (This is different from your API keys that authenticate Stripe API requests.)

Make sure that you handle the client secret carefully because it can complete the charge. Don’t log it, embed it in URLs, or expose it to anyone but the customer.

Use [stripe.confirmKlarnaPayment](https://docs.stripe.com/js/payment_intents/confirm_klarna_payment) to handle the redirect away from your page and to complete the payment. Add a [return_url](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-return_url) to this function to indicate where Stripe should redirect the user after they complete the payment on the Klarna website or mobile application.

On Klarna’s payments page, the customer selects among the payment options available in their market. See the table on [the overview page](https://docs.stripe.com/payments/klarna.md#payment-options) for availability by market. You can’t limit or pre-select payment options on the Klarna payments page-deferring this choice to the consumer maximizes their opportunity to transact with you.

```javascript
// Redirects away from the client
const {error} = await stripe.confirmKlarnaPayment(
  '{{PAYMENT_INTENT_CLIENT_SECRET}}',{
    return_url: 'https://example.com/checkout/complete',
  }
);
if (error) {
  // Inform the customer that there was an error.
}
```

When your customer submits a payment, Stripe redirects them to the `return_url` and includes the following URL query parameters. The return page can use them to get the status of the PaymentIntent so it can display the payment status to the customer.

When you specify the `return_url`, you can also append your own query parameters for use on the return page.

| Parameter                      | Description                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_intent`               | The unique identifier for the `PaymentIntent`.                                                                                                                                                                                                                                                                                                             |
| `payment_intent_client_secret` | The [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) of the `PaymentIntent` object. For subscription integrations, this client_secret is also exposed on the `Invoice` object through [`confirmation_secret`](https://docs.stripe.com/api/invoices/object.md#invoice_object-confirmation_secret) |

When the customer is redirected back to your site, you can use the `payment_intent_client_secret` to query for the PaymentIntent and display the transaction status to your customer.

You can find details about the Klarna payment option the customer selected on the `charge` in the [payment_method_details](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-klarna) property. There are four possible values: `pay_later`, `pay_with_financing`, `pay_now`, and `pay_in_installments`. See our [Klarna overview page](https://docs.stripe.com/payments/klarna.md#payment-options) for more information on these options.

You can also find the locale used to localize Klarna’s payments page under the [payment_method_details](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-klarna) property.

```json
{
  "charges": {
    "data": [
      {"payment_method_details": {
          "klarna": {
            "payment_method_category": "pay_in_installments",
            "preferred_locale": "en-US"
          },
          "type": "klarna"
        },
        "id": "src_16xhynE8WzK49JbAs9M21jaR",
        "object": "source",
        "amount": 1099,
        "client_secret": "src_client_secret_UfwvW2WHpZ0s3QEn9g5x7waU",
        "created": 1445277809,
        "currency": "eur",
        "livemode": true,
        "statement_descriptor": null,
        "status": "succeeded",
        "type": "klarna",
        "usage": "single_use"
      }
    ],
    "object": "list",
    "has_more": false,
    "url": "/v1/charges?payment_intent=pi_1G1sgdKi6xqXeNtkldRRE6HT"
  },
  "payment_method_options": {
    "klarna": {}
  },
  "payment_method_types": [
    "klarna"
  ],
  "id": "pi_1G1sgdKi6xqXeNtkldRRE6HT",
  "object": "payment_intent",
  "amount": 1099,
  "client_secret": "pi_1G1sgdKi6xqXeNtkldRRE6HT_secret_h9B56ObhTN72fQiBAuzcVPb2E",
  "confirmation_method": "automatic",
  "created": 1579259303,
  "currency": "eur",
  "livemode": true,
  "next_action": null
}
```

## Test your integration

> Klarna uses cookies for session tracking. To test different customer locations, log out of the Klarna sandbox from the previous session and use the relevant triggers.

Below, we have specially selected test data for the currently supported customer countries. In a sandbox, Klarna approves or denies a transaction based on the supplied email address.

#### Australia

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 03-05-1994               |
| First Name    | Test              | John                     |
| Last Name     | Person-au         | snow                     |
| Street        | Wharf St          | Silverwater Rd           |
| House number  | 4                 | 1-5                      |
| Postal Code   | 4877              | 2128                     |
| City          | Port Douglas      | Silverwater              |
| Region        | QLD               | NSW                      |
| Phone         | +61473752244      | +61473763254             |
| Email         | customer@email.au | customer+denied@email.au |

#### Austria

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 10-07-1970         | 10-07-1970               |
| First Name    | Test               | Test                     |
| Last Name     | Person-at          | Person-at                |
| Email         | customer@email.at  | customer+denied@email.at |
| Street        | Mariahilfer Straße | Mariahilfer Straße       |
| House number  | 47                 | 47                       |
| City          | Wien               | Wien                     |
| Postal code   | 1060               | 1060                     |
| Phone         | +4306762600456     | +4306762600745           |

#### Belgium

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-be         | Person-be                |
| Email         | customer@email.be | customer+denied@email.be |
| Street        | Grote Markt       | Grote Markt              |
| House number  | 1                 | 1                        |
| City          | Brussel           | Brussel                  |
| Postal code   | 1000              | 1000                     |
| Phone         | +32485121291      | +32485212123             |

#### Canada

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ca         | Person-ca                |
| Street        | 2693 Byron Rd     | 2693 Byron Rd            |
| Postal Code   | V7H 1L9           | V7H 1L9                  |
| City          | North Vancouver   | North Vancouver          |
| Region        | BC                | BC                       |
| Phone         | +15197438620      | +15197308624             |
| Email         | customer@email.ca | customer+denied@email.ca |

#### Czechia

|               | Approved           | Denied                   |
| ------------- | ------------------ | ------------------------ |
| Date of Birth | 01-01-1970         | 27-06-1992               |
| First Name    | Test               | Test                     |
| Last Name     | Person-cz          | Person-cz                |
| Email         | customer@email.cz  | customer+denied@email.cz |
| Street        | Zazvorkova 1480/11 | Zázvorkova 1480/11       |
| Postal code   | 155 00             | 155 00                   |
| City          | Praha              | PRAHA 13                 |
| Phone         | +420771613715      | +420771623691            |

#### Denmark

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-dk         | Person-dk                |
| Email         | customer@email.dk | customer+denied@email.dk |
| Street        | Dantes Plads      | Nygårdsvej               |
| House number  | 7                 | 65                       |
| City          | København Ø       | København Ø              |
| Postal code   | 1556              | 2100                     |
| Phone         | +4542555628       | +4552555348              |

#### Finland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1999        | 01-01-1999               |
| First Name    | Test              | Person FI                |
| Last Name     | Person-fi         | Test                     |
| Email         | customer@email.fi | customer+denied@email.fi |
| Street        | Mannerheimintie   | Mannerheimintie          |
| House number  | 34                | 34                       |
| City          | Helsinki          | Helsinki                 |
| Postal code   | 00100             | 00100                    |
| Phone         | +358401234567     | +358401234568            |

#### France

|                | Approved          | Denied                   |
| -------------- | ----------------- | ------------------------ |
| Date of Birth  | 10-07-1990        | 10-07-1990               |
| Place of Birth | Paris             | Paris                    |
| First Name     | Test              | Test                     |
| Last Name      | Person-fr         | Person-fr                |
| Email          | customer@email.fr | customer+denied@email.fr |
| Street         | rue La Fayette    | rue La Fayette           |
| House number   | 33                | 33                       |
| City           | Paris             | Paris                    |
| Postal code    | 75009             | 75009                    |
| Phone          | +33689854321      | +33687984322             |

#### Germany

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Mock                  | Test                     |
| Last Name     | Mock                  | Person-de                |
| Email         | customer@email.de     | customer+denied@email.de |
| Street        | Neue Schönhauser Str. | Neue Schönhauser Str.    |
| House number  | 2                     | 2                        |
| City          | Berlin                | Berlin                   |
| Postal code   | 10178                 | 10178                    |
| Phone         | +49017614284340       | +49017610927312          |

#### Greece

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Tax number    | 090000045         | 090000045                |
| Date of Birth | 01-01-1960        | 11-11-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-gr         | Test-gr                  |
| Email         | customer@email.gr | customer+denied@email.gr |
| Street        | Kephisias         | Baralo                   |
| House number  | 37                | 56                       |
| Postal code   | 151 23            | 123 67                   |
| City          | Athina            | Athina                   |
| Phone         | +306945553624     | +306945553625            |

#### Ireland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-ie         | Person-ie                |
| Email         | customer@email.ie | customer+denied@email.ie |
| Street        | King Street South | King Street South        |
| House Number  | 30                | 30                       |
| City          | Dublin            | Dublin                   |
| EIR Code      | D02 C838          | D02 C838                 |
| Phone         | +353855351400     | +353855351401            |

#### Italy

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1980        | 01-01-1980               |
| First Name    | Test              | Test                     |
| Last Name     | Person-it         | Person-it                |
| Email         | customer@email.it | customer+denied@email.it |
| Fiscal code   | RSSBNC80A41H501B  | RSSBNC80A41H501B         |
| Street        | Via Enrico Fermi  | Via Enrico Fermi         |
| House number  | 150               | 150                      |
| City          | Roma              | Roma                     |
| Postal code   | 00146             | 00146                    |
| Phone         | +393339741231     | +393312232389            |

#### Netherlands

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-nl         | Person-nl                |
| Email         | customer@email.nl | customer+denied@email.nl |
| Street        | Osdorpplein       | Osdorpplein              |
| House number  | 137               | 137                      |
| City          | Amsterdam         | Amsterdam                |
| Postal code   | 1068 SR           | 1068 SR                  |
| Phone         | +31689124321      | +31632167678             |

#### New Zealand

|               | Approved                 | Denied                   |
| ------------- | ------------------------ | ------------------------ |
| Date of Birth | 10-07-1970               | 10-07-1970               |
| First Name    | Test                     | Test                     |
| Last Name     | Person-nz                | Person-nz                |
| Street        | Mount Wellington Highway | Mount Wellington Highway |
| House number  | 286                      | 286                      |
| Postal Code   | 6011                     | 6011                     |
| City          | Auckland                 | Wellington               |
| Phone         | +6427555290              | +642993007712            |
| Email         | customer@email.nz        | customer+denied@email.nz |

#### Norway

|                 | Approved            | Denied                   |
| --------------- | ------------------- | ------------------------ |
| Date of Birth   | 01-08-1970          | 01-08-1970               |
| First Name      | Jane                | Test                     |
| Last Name       | Test                | Person-no                |
| Email           | customer@email.no   | customer+denied@email.no |
| Personal number | NO1087000571        | NO1087000148             |
| Street          | Edvard Munchs Plass | Sæffleberggate           |
| House Number    | 1                   | 56                       |
| City            | Oslo                | Oslo                     |
| Postal code     | 0194                | 0563                     |
| Phone           | +4740123456         | +4740123457              |

#### Poland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 05-05-1967        | 05-05-1967               |
| First Name    | Test              | Test                     |
| Last Name     | Person-pl         | Person-pl                |
| Street        | Ul. Górczewska    | Ul. Górczewska           |
| House number  | 124               | 124                      |
| Postal Code   | 01-460            | 01-460                   |
| City          | Warszawa          | Warszawa                 |
| Phone         | +48795222223      | +48795223325             |
| Email         | customer@email.pl | customer+denied@email.pl |

#### Portugal

|               | Approved            | Denied                   |
| ------------- | ------------------- | ------------------------ |
| Date of Birth | 10-07-1970          | 10-07-1970               |
| First Name    | Test                | Test                     |
| Last Name     | Person-pt           | Person-pt                |
| Street        | Avenida Dom João II | Avenida Dom João II      |
| House number  | 40                  | 40                       |
| Postal Code   | 1990-094            | 1990-094                 |
| City          | Lisboa              | Lisboa                   |
| Phone         | +351935556731       | +351915593837            |
| Email         | customer@email.pt   | customer+denied@email.pt |

#### Romania

|                                      | Approved          | Denied                   |
| ------------------------------------ | ----------------- | ------------------------ |
| Date of Birth                        | 25-12-1970        | 25-12-1970               |
| First Name                           | Test              | Test                     |
| Last Name                            | Person-ro         | Person-ro                |
| Email                                | customer@email.ro | customer+denied@email.ro |
| Street                               | Drumul Taberei    | Drumul Taberei           |
| House number                         | 35                | 35                       |
| City                                 | București         | București                |
| Sector                               | Sectorul 6        | Sectorul 6               |
| Postal code                          | 061357            | 061357                   |
| Phone                                | +40741209876      | +40707127444             |
| Personal Identification Number (CNP) | 1701225193558     |                          |

#### Spain

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| DNI/NIE       | 99999999R         | 99999999R                |
| Date of Birth | 10-07-1970        | 10-07-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-es         | Person-es                |
| Email         | customer@email.es | customer+denied@email.es |
| Street        | C. de Atocha      | C. de Atocha             |
| House number  | 27                | 27                       |
| City          | Madrid            | Madrid                   |
| Postal code   | 28012             | 28012                    |
| Phone         | +34672563009      | +34682425101             |

#### Sweden

|               | Approved                | Denied                   |
| ------------- | ----------------------- | ------------------------ |
| Date of Birth | 21-03-1941              | 28-10-1941               |
| First Name    | Alice                   | Test                     |
| Last Name     | Test                    | Person-se                |
| Email         | customer@email.se       | customer+denied@email.se |
| Street        | Södra Blasieholmshamnen | Karlaplan                |
| House number  | 2                       | 3                        |
| City          | Stockholm               | Stockholm                |
| Postal code   | 11 148                  | 11 460                   |
| Phone         | +46701740615            | +46701740620             |

#### Switzerland

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 01-01-1990        | 01-01-2000               |
| First Name    | Accepted          | Customer                 |
| Last Name     | Person-ch         | Person-ch                |
| Street        | Augustinergasse   | Bahnhofstrasse           |
| House number  | 2                 | 77                       |
| Postal Code   | 4051              | 8001                     |
| City          | Basel             | Zürich                   |
| Phone         | +41758680000      | +41758680001             |
| Email         | customer@email.ch | customer+denied@email.ch |

#### United Kingdom

|               | Approved              | Denied                   |
| ------------- | --------------------- | ------------------------ |
| Date of Birth | 10-07-1970            | 10-07-1970               |
| First Name    | Test                  | Test                     |
| Last Name     | Person-uk             | Person-uk                |
| Email         | customer@email.uk     | customer+denied@email.uk |
| Street        | New Burlington Street | New Burlington Street    |
| House number  | 10                    | 10                       |
| Apartment     | Apt 214               | Apt 214                  |
| Postal code   | W1S 3BE               | W1S 3BE                  |
| City          | London                | London                   |
| Phone         | +447755564318         | +447355505530            |

#### United States

|               | Approved          | Denied                   |
| ------------- | ----------------- | ------------------------ |
| Date of Birth | 07-10-1970        | 07-10-1970               |
| First Name    | Test              | Test                     |
| Last Name     | Person-us         | Person-us                |
| Email         | customer@email.us | customer+denied@email.us |
| Street        | Amsterdam Ave     | Amsterdam Ave            |
| House number  | 509               | 509                      |
| City          | New York          | New York                 |
| State         | New York          | New York                 |
| Postal code   | 10024-3941        | 10024-3941               |
| Phone         | +13106683312      | +13106354386             |

For production testing, you can use an amount of `3500` in your local currency to test all Klarna payment options besides Financing. For example, if you want to test “Pay in 3” in Italy, you can use a transaction of 35.00 EUR.

### Two-step authentication

Any six digit number is a valid two-step authentication code. Use `999999` for authentication to fail.

### Repayment method

Inside the Klarna flow, you can use the following test values to try various repayment types:

| Type          | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Direct Debit  | DE11520513735120710131                                                                  |
| Bank transfer | Demo Bank                                                                               |
| Credit Card   | - Number: 4111 1111 1111 1111
  - CVV: 123
  - Expiration: any valid date in the future |
| Debit Card    | - Number: 4012 8888 8888 1881
  - CVV: 123
  - Expiration: any valid date in the future |

## Failed payments 

Klarna takes into account multiple factors when deciding to accept or decline a transaction (for example, length of time buyer has been using Klarna, outstanding amount customer has to repay, value of the current order).

When the customer selects a deferred payment method, Klarna performs a risk assessment before accepting the transaction. Klarna might decline the transaction due to unsatisfactory risk assessment result, the transaction amount involved, or the customer having a large outstanding debt. As such, we recommend that you present additional payment options such as `card` in your checkout flow. In these cases, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions to `requires_payment_method`.

Customers are expected to complete the payment within 48 hours after they’re redirected to the Klarna site. If no action is taken after 48 hours, the [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) is detached and the [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) object’s status automatically transitions from `requires_action` to `requires_payment_method`.

In these cases, inform your customer to try again with a different payment option presented in your checkout flow.

### Klarna rate limits

API requests to Klarna are subject to additional rate limits beyond Stripe’s [API-wide rate limits](https://docs.stripe.com/rate-limits.md). These limits can differ depending on the shape of the API requests that you make. In general, if you make more than 50 requests per second, you might see rate limiting in the form of responses with HTTP status code `400` or `402`. Contact us using the form at [Stripe support](https://support.stripe.com) if you’re concerned that your usage might reach these levels, because Klarna might be able to increase these limits on a case-by-case basis.

### Error messaging

Failed Klarna payments normally return one of the following failure codes. These codes show in the [last_payment_error](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-last_payment_error) API object.

> Before the `2023-08-16` API version, every Klarna error reported as [payment_intent_authentication_failure](https://docs.stripe.com/error-codes.md#payment_intent_authentication_failure). Make sure your API version is up to date to see the detailed errors listed below.

| Failure code                                                                                                            | Explanation                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [payment_method_customer_decline](https://docs.stripe.com/error-codes.md#payment-method-customer-decline)               | The customer canceled the checkout on Klarna’s page                                             |
| [payment_method_provider_decline](https://docs.stripe.com/error-codes.md#payment-method-provider-decline)               | Klarna declined the customer’s payment                                                          |
| [payment_intent_payment_attempt_expired](https://docs.stripe.com/error-codes.md#payment-intent-payment-attempt-expired) | The customer never completed the checkout on Klarna’s page, and the payment session has expired |
| [payment_method_not_available](https://docs.stripe.com/error-codes.md#payment-method-not-available)                     | An unexpected error occurred when trying to use Klarna                                          |

## Optional customizations

You can optionally implement several different customizations for Klarna payment flows (such as separating the authorization and capture of funds) and customer interactions (such as handling redirects).

### Separate authorization and capture 

Klarna supports [separate authorization and capture](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md). If there’s a delay between the payment and delivering the goods to your customer, authorize the payment first and capture it later. At the point of capture, Klarna sends a statement to the customer and initiates the due dates on any subsequent payments that they must make. **An authorized Klarna payment must be captured within 28 days of the authorization**. Otherwise, the authorization automatically cancels and you can no longer capture the payment.

1. Tell Stripe to authorize only

   To indicate that you want separate authorization and capture, set [capture_method](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-capture_method) to `manual` when creating the PaymentIntent. This parameter instructs Stripe to only authorize the amount on the customer’s Klarna account.

   ```curl
   curl https://api.stripe.com/v1/payment_intents \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d "payment_method_types[]=klarna" \
     -d amount=1099 \
     -d currency=eur \
     -d capture_method=manual
   ```

1. Capture the funds

   After the authorization succeeds, the PaymentIntent [status](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-status) transitions to `requires_capture`. To capture the authorized funds, make a PaymentIntent [capture](https://docs.stripe.com/api/payment_intents/capture.md) request. The total authorized amount is captured by default—you can’t capture more than this, but you can capture less.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/capture \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d amount_to_capture=750
   ```

1. (Optional) Cancel the authorization

   Klarna counts any authorized payments against the customer’s total purchasing power within Klarna. Make sure that you actively cancel any authorized payments that you can’t fulfill (for example, the goods can’t be shipped) as soon as this becomes apparent.

   ```curl
   curl https://api.stripe.com/v1/payment_intents/{{PAYMENTINTENT_ID}}/cancel \
     -u "<<YOUR_SECRET_KEY>>:" \
     -d cancellation_reason=abandoned
   ```

### Handle the Klarna redirect manually 

We recommend relying on Stripe.js to handle Klarna redirects and payments client-side with `confirmKlarnaPayment`. Using Stripe.js helps extend your integration to other payment methods. However, you can also manually redirect your customers on your server by following these steps:

- Create and confirm a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) of type `klarna`. You must provide the post-payment redirect URL for your customer in the `return_url` field. You can provide your own query parameters in this URL, and the redirect flow’s final URL will include them.

  ```curl
  curl https://api.stripe.com/v1/payment_intents \
    -u "<<YOUR_SECRET_KEY>>:" \
    -d "payment_method_types[]=klarna" \
    -d amount=1099 \
    -d currency=eur \
    -d confirm=true \
    --data-urlencode "return_url=https://example.com/checkout/complete" \
    -d "payment_method_data[type]=klarna"
  ```

- The created `PaymentIntent` has a status of `requires_action` and the type for `next_action` is `redirect_to_url`.

  #### JSON

  ```json
  {"status": "requires_action",
    "next_action": {
      "type": "redirect_to_url",
      "redirect_to_url": {
        "url": "https://hooks.stripe.com/...",
        "return_url": "https://example.com/checkout/complete"
      }
    },
    "id": "pi_1G1sgdKi6xqXeNtkldRRE6HT",
    "object": "payment_intent",
    "amount": 1099,
    "client_secret": "pi_1G1sgdKi6xqXeNtkldRRE6HT_secret_h9B56ObhTN72fQiBAuzcVPb2E",
    "confirmation_method": "automatic",
    "created": 1579259303,
    "currency": "eur",
    "livemode": true,
    "charges": {
      "data": [],
      "object": "list",
      "has_more": false,
      "url": "/v1/charges?payment_intent=pi_1G1sgdKi6xqXeNtkldRRE6HT"
    },
    "payment_method_options": {
      "klarna": {}
    },
    "payment_method_types": [
      "klarna"
    ]
  }
  ```

- Redirect the customer to the URL provided in the `next_action.redirect_to_url.url` property. The code example here is approximate—the redirect method might be different in your web framework.

  #### Ruby

  ```ruby
  if payment_intent.status == 'requires_action' && payment_intent.next_action.type == 'redirect_to_url'
    url = payment_intent.next_action.redirect_to_url.url
    redirect(url)
  end
  ```

When the customer finishes the payment process, they’re sent to the `return_url` configured in step 1. The `payment_intent` and `payment_intent_client_secret` URL query parameters are included. If `return_url` already included query parameters, they’re preserved too.

We recommend that you [rely on webhooks](https://docs.stripe.com/payments/payment-intents/verifying-status.md#webhooks) to confirm the status of a payment.

### Handle post-payment events 

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the Dashboard, a custom *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests), or a partner solution to receive these events and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events also helps you accept more payment methods in the future. Learn about the [differences between all supported payment methods](https://stripe.com/payments/payment-methods-guide).

- **Handle events manually in the Dashboard**

  Use the Dashboard to [View your test payments in the Dashboard](https://dashboard.stripe.com/test/payments), send email receipts, handle payouts, or retry failed payments.

- **Build a custom webhook**

  [Build a custom webhook](https://docs.stripe.com/webhooks/handling-payment-events.md#build-your-own-webhook) handler to listen for events and build custom asynchronous payment flows. Test and debug your webhook integration locally with the Stripe CLI.

- **Integrate a prebuilt app**

  Handle common business events, such as [automation](https://stripe.partners/?f_category=automation) or [marketing and sales](https://stripe.partners/?f_category=marketing-and-sales), by integrating a partner application.

### Customize the Klarna payment page 

- **Prefill the Klarna form** 

  When the customer chooses to pay Klarna with a deferred payment option (pay later, installments, and financing), Klarna collects enough information for risk assessment and approval. The type of information depends on the country of the customer. For most countries in Europe, it’s the full billing details and date of birth. You can pass this information through the API, and the form will be prefilled when your customer arrives on the page.

  ```curl
  curl https://api.stripe.com/v1/payment_intents \
    -u "<<YOUR_SECRET_KEY>>:" \
    -d "payment_method_types[]=klarna" \
    -d amount=1099 \
    -d currency=eur \
    -d confirm=true \
    --data-urlencode "return_url=https://example.com/checkout/complete" \
    -d "payment_method_data[type]=klarna" \
    --data-urlencode "payment_method_data[billing_details][email]=customer@example.com" \
    -d "payment_method_data[billing_details][name]=Jenny Rosen" \
    --data-urlencode "payment_method_data[billing_details][phone]=+4915142321555" \
    -d "payment_method_data[billing_details][address][line1]=Alexanderplatz 1" \
    -d "payment_method_data[billing_details][address][city]=Berlin" \
    -d "payment_method_data[billing_details][address][postal_code]=10551" \
    -d "payment_method_data[billing_details][address][country]=DE" \
    -d "payment_method_data[klarna][dob][day]=10" \
    -d "payment_method_data[klarna][dob][month]=10" \
    -d "payment_method_data[klarna][dob][year]=1990"
  ```
![Screenshot of a Klarna payment page prefilled with billing details from the API and customized to render in English](https://b.stripecdn.com/docs-statics-srv/assets/klarna-kpp-prefilled-customized.75932cc9aa3223960aa2fcf769c1ce62.png)
  
  A Klarna payment page prefilled with billing details from the API and customized to render in English for a customer in Germany

### Add line items to the PaymentIntent 

> #### Unified line items with Klarna
> 
> To optimize approval rates when you integrate with Klarna, include `line_items` data to represent what’s in a shopper’s cart. For early access, see [Payments line items](https://docs.stripe.com/payments/payment-line-items.md).

### Display payment method messaging on your website 

The [Payment Method Messaging Element](https://docs.stripe.com/js/elements_object/create_element?type=paymentMethodMessaging) is an embeddable UI component that helps your customers know which buy now, pay later payment options they have at checkout directly from your product, cart, or payment pages.

To add the Payment Method Messaging Element to your website, see [Display payment method messaging](https://docs.stripe.com/elements/payment-method-messaging.md).
