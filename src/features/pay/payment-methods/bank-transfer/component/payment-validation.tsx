import { Col, Row, Typography } from "antd";

export const PaymentValidation = ({
  validateTimer,
}: {
  validateTimer: string;
}) => (
  <Col className="!mb-40">
    <Row align="middle" justify="center" className="!gap-5 !mt-16">
      <div className="payment-validator-loader" />
      <Typography className="!text-[#00000080] !text-lg !text-center">
        Confirming the status of your transaction
      </Typography>
    </Row>
    <Typography className="!text-center !text-lg !mt-8 !text-[#00000066]">
      Expires in <span className="text-[#EC1C24CC]">{validateTimer}</span>{" "}
      minutes
    </Typography>
  </Col>
);
