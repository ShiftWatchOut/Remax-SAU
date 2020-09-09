import React, { ReactNode, useState } from "react";
import { Icon } from "anna-remax-ui";
import { View, Text } from "remax/wechat";
import styles from "./index.less";

interface Props {
  children?: ReactNode;
  position?: "top" | "left";
  size?: string;
}

export default ({ children, position = "left", size = "50rpx" }: Props) => {
  const [expand, setExpand] = useState(false);
  return (
    <View className={styles.drop_container}>
      <View
        className={`${styles.icon} ${expand && styles.rotate}`}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <Icon size={size} type="add" />
      </View>
      <View
        className={`${styles.children} ${!expand && styles.hidden} ${
          position === "top" ? styles.top : styles.left
        }`}
      >
        {children}
      </View>
    </View>
  );
};
