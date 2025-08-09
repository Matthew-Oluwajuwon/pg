import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Switch,
  Typography,
} from "antd";
import { useCardInfo, useDisableEvent } from "../hooks";
import { formatPrice, useStore } from "@/lib";
import { useMakePayment } from "@/features";
import { OtpVerification } from "../otp-verification";

export const NewCard = () => {
  const { selectedSavedCard, isMakePaymentSuccessful } = useStore(
    (state) => state,
  );
  const { cardNumberInputRef, cvvInputRef, expiryInputRef } = useDisableEvent();
  const { onMakePayment, isPending, data } = useMakePayment();

  const {
    cardNumberValidator,
    cardImg,
    getCardNumberMaxLength,
    validateExpiryDate,
    form,
    paymentInfo,
    isFormIncomplete,
    isSavingCard,
    handleOnSavedCard,
    handleCardInput,
    handleCardExpiry,
  } = useCardInfo();

  if (isMakePaymentSuccessful) {
    return <OtpVerification makePaymentData={data} />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(request) =>
        onMakePayment({
          cardNumber: selectedSavedCard
            ? selectedSavedCard?.cardPan
            : request?.cardNumber,
          cardHolderName: selectedSavedCard
            ? selectedSavedCard?.cardHolderName
            : request?.cardHolderName,
          expiryMonth: selectedSavedCard
            ? selectedSavedCard?.expiryMonth
            : request?.expiryDate.split("/")[0],
          expiryYear: selectedSavedCard
            ? selectedSavedCard?.expiryYear
            : request?.expiryDate.split("/")[1],
          cvv: request?.cvv,
          pin: request?.pin,
        })
      }
      wrapperCol={{ span: 24 }}
      labelCol={{ span: 24 }}
      requiredMark="optional"
      className="!mb-5"
    >
      <Form.Item
        label="Card Number"
        name="cardNumber"
        rules={[
          { required: true, message: "Card number is required" },
          {
            validator(_rule, value) {
              return cardNumberValidator(_rule, value);
            },
          },
        ]}
      >
        <Input
          placeholder="xxxx xxxx xxxx xxxx"
          className="!text-[12px] !py-3"
          autoComplete="cc-number"
          ref={cardNumberInputRef}
          maxLength={getCardNumberMaxLength()}
          onChange={handleCardInput}
          suffix={
            cardImg() ? (
              <img src={cardImg()} className="w-10 h-10 object-contain" />
            ) : (
              <span />
            )
          }
        />
      </Form.Item>
      <Form.Item
        label="Cardholder Name"
        name="cardHolderName"
        className="!-my-5"
      >
        <Input id="cardholderName" className="!text-[12px] !py-3" />
      </Form.Item>

      <Row justify="space-between" className="mt-8">
        <Col span={11}>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[
              { required: true, message: "Expiry date is required" },
              {
                validator(_rule, value) {
                  if (value) {
                    const result = validateExpiryDate(value);
                    if (!result) {
                      return Promise.reject(new Error("Invalid expiry date"));
                    }
                    if (result === "The card has expired!") {
                      return Promise.reject(new Error(result));
                    }
                    const nextEle = document.getElementById(
                      "cvv",
                    ) as HTMLInputElement | null;
                    nextEle?.focus();
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="MM/YY"
              id="expiry"
              ref={expiryInputRef}
              className="!text-[12px] !py-3"
              onChange={handleCardExpiry}
              autoComplete="cc-exp"
            />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            label="CVV"
            name="cvv"
            rules={[
              { required: true, message: "CVV is required" },
              {
                validator(_rule, value) {
                  if ((value?.length as number) < 3) {
                    return Promise.reject(new Error("CVV must be three digit"));
                  } else {
                    const nextEle = document.getElementById(
                      "pin",
                    ) as HTMLInputElement | null;
                    nextEle?.focus();
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              placeholder="123"
              id="cvv"
              ref={cvvInputRef}
              maxLength={3}
              minLength={3}
              type="password"
              className="!text-[12px] !py-3"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" className="mb-5">
        <Col span={18}>
          <Typography className="!text-[#000000B2] !text-[12px] !font-light">
            Save card details
          </Typography>
          <Typography className="!text-[#00000066] !text-[12px] !font-light">
            This will ensure instant checkout in future
          </Typography>
        </Col>
        <Col span={4}>
          <Popconfirm
            title="Are you sure you want to save this card?"
            cancelText="No"
            okText="Yes"
            okButtonProps={{ loading: isSavingCard }}
            onConfirm={handleOnSavedCard}
          >
            <Switch disabled={isFormIncomplete} />
          </Popconfirm>
        </Col>
      </Row>

      <Col className="mt-10">
        <Typography className="!text-center !text-[#535862] !text-[12px]">
          Enter your 4 digit card PIN
        </Typography>
        <Row justify="center" className="my-5">
          <Form.Item
            name="pin"
            rules={[{ required: true, message: "PIN is required" }]}
          >
            <Input.OTP size="large" id="pin" length={4} mask="*" />
          </Form.Item>
        </Row>
      </Col>
      <Button
        type="primary"
        htmlType="submit"
        loading={isPending}
        className="!py-8"
        block
      >
        Pay {formatPrice(paymentInfo?.amount as string, paymentInfo?.currency)}
      </Button>
    </Form>
  );
};
