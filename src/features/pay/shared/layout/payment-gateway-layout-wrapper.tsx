// components/PaymentGatewayLayout.tsx
import {
  useEffect,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { SideBar } from "./side-bar";
import { Row, Typography } from "antd";
import notFound from "@/assets/images/404.svg";
import PayxyFooter from "/favicon.svg";
import { useGetPaymentInfo, type PaymentInfoData } from "@/features";
import { emitter } from "@/lib";

interface PaymentGatewayLayoutProps extends PropsWithChildren {
  heading?: string;
  subtext?: string;
  showSidebar?: boolean;
  footer?: ReactNode;
}

const fallbackMessage =
  "There was an issue with your transaction. If the problem persists, please contact support.";

const LoadingState = () => (
  <div className="card-shadow p-10 pb-5 rounded-lg bg-white h-[40rem] flex flex-col items-center justify-center">
    <div className="loader mb-5" />
    <Typography>Initializing Payment Gateway</Typography>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="card-shadow p-10 pb-5 rounded-lg bg-white h-[40rem] flex flex-col items-center justify-center">
    <img src={notFound} alt="Not found" className="mb-5" />
    <Typography.Title className="!max-w-[70%] text-center !text-3xl">
      Payment Not Found
    </Typography.Title>
    <Typography className="!max-w-[70%] text-center !text-[#00000080]">
      {message}
    </Typography>
  </div>
);

export const PaymentGatewayLayoutWrapper: FC<PaymentGatewayLayoutProps> = ({
  children,
  heading = "Payment Method",
  subtext = "Select a payment method",
  showSidebar = true,
  footer = (
    <Row align="middle" justify="center">
      <Typography className="!text-[#313EF7CC]">Powered by Payxy</Typography>
      <img src={PayxyFooter} className="w-12" alt="Payxy logo" />
    </Row>
  ),
}) => {
  const { isLoading, isError, data } = useGetPaymentInfo();

  useEffect(() => {
    emitter.emit("payment-info:loaded", data?.data as PaymentInfoData);
  }, [data?.data]);

  const isFailed =
    isError ||
    data?.responseCode !== "00" ||
    !data?.responseMessage?.toLowerCase().includes("successful");

  return (
    <div className="relative flex flex-col items-center">
      {/* Background */}
      <div className="absolute top-[5rem] inset-0 bg-[url('@/assets/images/ornament.jpg')] bg-no-repeat bg-top opacity-20 z-0" />

      {/* Container */}
      <div className="relative z-10 w-[65rem] p-10 rounded-lg input-box-shadow mt-20">
        <h1 className="font-semibold text-2xl">{heading}</h1>
        <p className="text-sm text-[#0A0D13] mt-3 mb-8">{subtext}</p>

        {isLoading ? (
          <LoadingState />
        ) : isFailed ? (
          <ErrorState message={data?.responseMessage ?? fallbackMessage} />
        ) : (
          <div className="card-shadow p-10 pb-5 rounded-lg bg-white grid grid-cols-[15rem_1fr] gap-5">
            {showSidebar && <SideBar paymentInfo={data?.data} />}
            <div className="flex flex-col border-l pl-10 border-[#00000010]">
              <div className="flex-1">{children}</div>
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
