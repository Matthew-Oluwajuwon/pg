import {
  useTimer,
  useValidatePayment,
  type MakePaymentResponse,
} from "@/features";
import { errorModalProps, formatPrice, useStore } from "@/lib";
import { App, Button, Form, Input, Row, Typography } from "antd";
import { useEffect, type FC } from "react";

export const OtpVerification: FC<{
  makePaymentData: MakePaymentResponse | undefined;
}> = ({ makePaymentData }) => {
  const { modal } = App.useApp();
  const { paymentInfo } = useStore((state) => state);
  const { timeRemaining, timeValue } = useTimer(600);
  const { onValidatePayment, isPending } = useValidatePayment();

  useEffect(() => {
    if (timeValue === 0) {
      modal.error({
        ...errorModalProps(paymentInfo?.callbackUrl),
        content: "Payment timed out, unable to process transaction",
      });
    }
  }, [modal, paymentInfo?.callbackUrl, timeValue]);

  return (
    <div className="mb-10">
      <Typography className="font-semibold text-xl">
        Payment Authentication
      </Typography>
      <Typography className="!text-sm !text-[#535862]">
        Enter the One Time Password sent to the mobile number registered with
        your bank
      </Typography>

      <Form
        layout="vertical"
        className="!my-10"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={(request) =>
          onValidatePayment({
            providerReference: makePaymentData?.providerReference ?? "",
            transactionId: paymentInfo?.transactionId ?? "",
            entryType: 0,
            otp: request?.otp,
          })
        }
      >
        <Row justify="center" className="my-5">
          <Form.Item name="otp">
            <Input.OTP size="large" length={6} mask="*" />
          </Form.Item>
        </Row>

        <Button
          type="primary"
          loading={isPending}
          htmlType="submit"
          className="!py-8"
          block
        >
          Pay{" "}
          {formatPrice(paymentInfo?.amount as string, paymentInfo?.currency)}
        </Button>
      </Form>
      <Typography className="!text-center !text-lg !mt-5 !text-[#00000066]">
        This page will automatically timeout in{" "}
        <span className="text-[#EC1C24CC]">{timeRemaining}</span> minutes
      </Typography>
    </div>
  );
};
