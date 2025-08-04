import { Button, Card, Row, Typography } from "antd";
import { formatPrice, useStore } from "@/lib";
import { Copy } from "iconoir-react";
import { useMakePayment } from "../../api";
import { useEffect } from "react";
import { useTimer } from "@/features";

export const BankTransfer = () => {
  const { timeRemaining } = useTimer(5);

  const { paymentInfo } = useStore((state) => state);
  const { onMakePayment, isPending, data } = useMakePayment();

  useEffect(() => {
    onMakePayment({
      paymentType: 5,
      bankCode: "044",
    });
  }, [onMakePayment]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[30rem]">
        <div className="loader mb-5" />
        <span>Processing please wait...</span>
      </div>
    );
  }

  return (
    <div className="">
      <Typography className="text-center !w-[90%] !text-lg">
        Transfer the sum of{" "}
        <strong>
          {formatPrice(paymentInfo?.amount as string, paymentInfo?.currency)}
        </strong>{" "}
        to the displayed bank account{" "}
      </Typography>
      {!isPending && data?.authenticatePaymentResponseCode === "09" ? (
        <>
          <div className="!border !border-[#EB001BCC] !border-dashed !bg-[#EB001B0D] !p-3 !my-5 !rounded-lg">
            <Typography className="!w-[60%] !text-lg !text-center mx-auto !text-[#EB001BCC]">
              Do not transfer more than once to the account below
            </Typography>
          </div>
          <Card className="!bg-[#F9FAFA] !border-none !mt-10">
            <Row justify="space-between">
              <Typography className="!text-lg !text-[#00000080]">
                Bank Name
              </Typography>
              <Typography className="!text-lg !text-[#000000B2] !font-medium">
                {data?.bankName}
              </Typography>
            </Row>
            <Row justify="space-between" className="!my-5">
              <Typography className="!text-lg !text-[#00000080]">
                Account Number
              </Typography>
              <Typography className="!text-lg !text-[#000000B2] !font-medium !flex !items-center !gap-1">
                {data?.accountNumber}{" "}
                <Copy className="cursor-pointer transition-all active:scale-75" />
              </Typography>
            </Row>
            <Row justify="space-between">
              <Typography className="!text-lg !text-[#00000080]">
                Account Name
              </Typography>
              <Typography className="!text-lg !text-[#000000B2] !font-medium">
                {data?.accountName}
              </Typography>
            </Row>
          </Card>
          <Typography className="!text-center !text-lg !mt-5 !text-[#00000066]">
            Expires in <span className="text-[#EC1C24CC]">{timeRemaining}</span>{" "}
            minutes
          </Typography>
          <Button type="primary" className="my-10" block>
            Transfer Done
          </Button>
        </>
      ) : !isPending && data?.authenticatePaymentResponseCode !== "09" ? (
        <div className="!border !border-[#EB001BCC] !border-dashed !bg-[#EB001B0D] !p-3 !my-28 !rounded-lg">
          <Typography className="!w-[60%] !text-lg !text-center mx-auto !text-[#EB001BCC]">
            {data?.authenticatePaymentResponseMessage ??
              "Unable to process transaction at this time."}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};
