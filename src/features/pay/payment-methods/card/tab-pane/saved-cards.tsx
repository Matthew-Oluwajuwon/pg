import { useState } from "react";
import { Dropdown, Empty, Tag } from "antd";
import mastercardLogo from "@/assets/images/mastercard.svg";
import visaLogo from "@/assets/images/visa.png";
import verveLogo from "@/assets/images/verve.png";
import amexLogo from "@/assets/images/amex.png";
import dayjs from "dayjs";
import clsx from "clsx";
import threeDot from "@/assets/svgs/three-dot.svg";
import {
  useGetSavedCards,
  useRemoveCard,
  type SavedCards as SavedCard,
} from "../api";
import { useStore } from "@/lib";

const brandLogos = {
  mastercard: mastercardLogo,
  visa: visaLogo,
  verve: verveLogo,
  amex: amexLogo,
};

export const SavedCards = () => {
  const {
    paymentInfo,
    selectedSavedCard,
    setSelectedSavedCard,
    setCardOption,
  } = useStore((state) => state);
  const { data, isLoading } = useGetSavedCards();
  const { onRemoveCard } = useRemoveCard();
  const [removingCardPan, setRemovingCardPan] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loader mb-5" />
      </div>
    );
  }

  if (!data?.data || data?.data?.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No saved cards"
        className="my-10"
      />
    );
  }

  const handleRemove = async (cardPan: string) => {
    setRemovingCardPan(cardPan);
    try {
      await onRemoveCard({
        email: paymentInfo?.email as string,
        pan: cardPan,
      });
    } finally {
      setRemovingCardPan(null);
    }
  };

  const handleSelectingSavedCard = (card: SavedCard) => {
    if (selectedSavedCard?.cardPan !== card?.cardPan) {
      setSelectedSavedCard(card);
    } else {
      setSelectedSavedCard(null);
    }
    setCardOption("1");
  };

  return (
    <div className="space-y-8 mb-10">
      {data?.data?.map((card, index) => {
        const isExpired = dayjs().isAfter(
          dayjs(`${card.expiryYear}-${card.expiryMonth}-01`).endOf("month"),
        );

        const isRemoving = removingCardPan === card.cardPan;

        return (
          <div
            key={index}
            className={clsx(
              "flex items-center justify-between border rounded-lg p-4 cursor-pointer transform transition-all active:scale-95",
              isExpired
                ? "border-[#EC1C2499]"
                : "border-[#8E98A84D] hover:border-[#0569FF]",
              selectedSavedCard?.cardPan === card?.cardPan &&
                "border-[#0569FF]",
            )}
          >
            <div className="flex items-start justify-between w-full">
              <div
                onClick={() => handleSelectingSavedCard(card)}
                className="flex items-start space-x-5"
              >
                <img
                  src={brandLogos[card.cardBrand as keyof typeof brandLogos]}
                  alt={card.cardBrand}
                  className="w-14 h-10 object-contain border border-[#00000033] p-2 mt-1"
                />
                <div>
                  <p className="text-[#000000B2]">
                    {card.cardBrand?.charAt(0).toUpperCase() +
                      card?.cardBrand?.slice(1)}{" "}
                    {card.cardPan.slice(0, 4)} xxxx xxxx{" "}
                    {card.cardPan.slice(-4)}
                  </p>
                  <p className="text-[#535862B2] font-extralight text-sm my-2">
                    Expiry: {card.expiryMonth}/{card.expiryYear}
                  </p>
                  <p className="italic text-[#535862] text-base">
                    {card?.cardHolderName}
                  </p>
                </div>
              </div>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: "remove",
                      label: "Remove",
                      className: "!text-base !text-[#FF0000]",
                      onClick: () => handleRemove(card.cardPan),
                    },
                  ],
                }}
              >
                {isRemoving ? (
                  <div className="loader mb-5 !w-7" />
                ) : (
                  <img src={threeDot} className="!z-50" />
                )}
              </Dropdown>
            </div>

            {isExpired && (
              <Tag color="red" className="px-2 py-1 rounded">
                Card expired. Please, add a valid card.
              </Tag>
            )}
          </div>
        );
      })}
    </div>
  );
};
