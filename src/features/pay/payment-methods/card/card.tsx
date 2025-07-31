import { ConfigProvider, Tabs, type TabsProps } from "antd";
import "./style.css";
import { NewCard, SavedCards } from "./tab-pane";

export const Card = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "New Card",
      children: <NewCard />,
    },
    {
      key: "2",
      label: "Saved Cards",
      children: <SavedCards />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            colorPrimary: "#0569FFCC",
            itemColor: "#00000080",
            fontSize: 12,
          },
        },
      }}
    >
      <Tabs size="small" defaultActiveKey="1" items={items} />
    </ConfigProvider>
  );
};
