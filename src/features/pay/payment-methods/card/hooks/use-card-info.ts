import { useCallback, useMemo, useState } from "react";
import mastercard from "@/assets/images/mastercard.svg";
import visa from "@/assets/images/visa.png";
import verve from "@/assets/images/verve.png";
import discover from "@/assets/images/discover.png";
import diner from "@/assets/images/diners.png";
import maestro from "@/assets/images/maestro.png";
import jcb from "@/assets/images/jcb.jpeg";
import amex from "@/assets/images/amex.png";
import BIN from "../bin.json";
import { CardTypes } from "@/config";
import type { RuleObject } from "antd/es/form";
import type { Bin } from "./types";
import { Form } from "antd";

// Map card types to their images
const cardImages: Record<string, string> = {
  [CardTypes.MASTERCARD]: mastercard,
  [CardTypes.VISA]: visa,
  [CardTypes.VERVE]: verve,
  [CardTypes.AMERICAN_EXPRESS]: amex,
  [CardTypes.DINERS_CLUB]: diner,
  [CardTypes.JCB]: jcb,
  [CardTypes.DISCOVER]: discover,
  [CardTypes.MAESTRO]: maestro,
};

export const useCardInfo = () => {
  const [form] = Form.useForm();
  const [cardType, setCardType] = useState("");

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "") // remove non-digit characters
      .replace(/(.{4})/g, "$1 ") // insert space after every 4 digits
      .trim();

  const CARD_TYPE_MAP: Record<string, string> = useMemo(() => {
    return {
      VISA: CardTypes.VISA,
      MASTERCARD: CardTypes.MASTERCARD,
      VERVE: CardTypes.VERVE,
      "AMERICAN EXPRESS": CardTypes.AMERICAN_EXPRESS,
      "DINERS CLUB": CardTypes.DINERS_CLUB,
      JCB: CardTypes.JCB,
      DISCOVER: CardTypes.DISCOVER,
      MAESTRO: CardTypes.MAESTRO,
    };
  }, []);

  const validateCardType = useCallback(
    (value: string, bin: Bin[]): string => {
      const cardNumber = value.replace(/\s/g, "");

      for (const cardBin of bin) {
        const cardPrefix = cardNumber.slice(
          0,
          cardBin.BinRangeMinimum.toString().length,
        );

        if (
          parseInt(cardPrefix) >= cardBin.BinRangeMinimum &&
          parseInt(cardPrefix) <= cardBin.BinRangeMaximum &&
          cardNumber.length >= cardBin.MinPanLength &&
          cardNumber.length <= cardBin.MaxPanLength
        ) {
          return CARD_TYPE_MAP[cardBin.Name] ?? CardTypes.NOT_FOUND;
        }
      }

      return CardTypes.NOT_FOUND;
    },
    [CARD_TYPE_MAP],
  );

  const cardNumberValidator = (
    _rule: RuleObject,
    value: string,
  ): Promise<void> => {
    if (!value?.trim()) return Promise.resolve();

    const formattedValue = value.replace(/\s+/g, "");
    const result = validateCardType(formattedValue, BIN.Bin);

    setCardType(result);

    return result === CardTypes.NOT_FOUND
      ? Promise.reject(new Error("Card number is invalid"))
      : Promise.resolve();
  };

  const cardImg = useCallback(() => cardImages[cardType] ?? "", [cardType]);

  const getCardNumberMaxLength = useCallback(() => {
    switch (cardType) {
      case "mastercard":
      case "visa":
        return 19;
      case "verve":
        return 23;
      case "afriglobal":
        return 22;
      default:
        return 24;
    }
  }, [cardType]);

  const validateAndFormatExpiryDate = (cardExpiry: string): string => {
    const formattedExpiry = cardExpiry
      .replace(/[^0-9]/g, "") // Allow only numbers
      .replace(/^([2-9])$/g, "0$1") // 3 > 03
      .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2") // 13 > 01/3
      .replace(/^0{1,}/g, "0") // 00 > 0
      .replace(/^([0-1]{1}[0-9]{1})([0-9]{2,4})$/g, "$1/$2"); // 113 > 11/3 or 2023 > 11/2023

    return formattedExpiry.length > 2 && !formattedExpiry.includes("/")
      ? formattedExpiry.slice(0, 2) + "/" + formattedExpiry.slice(2)
      : formattedExpiry;
  };

  const validateExpiryDate = (cardExpiry: string): boolean | string => {
    const formattedExpiry = validateAndFormatExpiryDate(cardExpiry);
    const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!regex.test(formattedExpiry)) {
      return false;
    }

    const [, year] = formattedExpiry.split("/");
    const currentYear = new Date().getFullYear() % 100;

    if (parseInt(year, 10) < currentYear) {
      return "The card has expired!";
    }

    return true;
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setFieldsValue({ cardNumber: formatted });
  };
  const handleCardExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = validateAndFormatExpiryDate(e.target.value);
    form.setFieldsValue({ expiryDate: formatted });
  };

  return {
    cardImg,
    cardNumberValidator,
    formatCardNumber,
    getCardNumberMaxLength,
    validateAndFormatExpiryDate,
    validateExpiryDate,
    handleCardInput,
    handleCardExpiry,
    form,
  };
};
