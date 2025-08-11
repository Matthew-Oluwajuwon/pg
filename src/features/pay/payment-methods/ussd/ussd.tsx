import { Row, Select, Typography } from "antd";
import { Copy } from "iconoir-react";
import { useUSSD } from "./hooks";
import { LOADING_MESSAGE } from "@/config";

export const USSD = () => {
  const {
    handleBankChange,
    bankOptions,
    isLoading,
    makePaymentData,
    isPending,
    validatePaymentIsPending,
    timeRemaining,
  } = useUSSD();

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-10 my-32">
      <div className="loader mb-5" />
      <span>{LOADING_MESSAGE}</span>
    </div>
  );

  const renderPaymentInstructions = () => {
    if (!makePaymentData || makePaymentData?.responseCode === "04") return null;

    return (
      <>
        <div className="!border !border-[#31B454CC] !border-dashed !mt-10 !bg-[#31B45405] !p-3 !my-5 !rounded-lg">
          <Typography className="!w-[60%] !text-2xl !flex !items-center !justify-center !gap-2 !text-center mx-auto !text-[#000000B2]">
            {makePaymentData.authenticatePaymentResponseMessage}
            <Copy className="cursor-pointer transition-all active:scale-75" />
          </Typography>
        </div>

        <Typography className="!text-center !text-lg !mt-8 !text-[#00000066]">
          Expires in <span className="text-[#EC1C24CC]">{timeRemaining}</span>{" "}
          minutes
        </Typography>

        {validatePaymentIsPending && (
          <Row align="middle" justify="center" className="!gap-5 !mt-16">
            <div className="payment-validator-loader" />
            <Typography className="!text-[#00000080] !text-lg !text-center">
              Confirming the status of your transaction
            </Typography>
          </Row>
        )}
      </>
    );
  };

  return (
    <div className="h-[30rem]">
      <Select
        loading={isLoading}
        className="!w-full !h-16"
        placeholder="Choose Bank"
        showSearch
        onChange={handleBankChange}
        filterOption={(input, option) =>
          (option?.label ?? "")
            .toString()
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={bankOptions}
      />

      {isPending ? renderLoader() : renderPaymentInstructions()}
    </div>
  );
};
