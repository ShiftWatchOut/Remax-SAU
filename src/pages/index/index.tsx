import * as React from "react";
import { View, Text, Image, navigateTo } from "remax/wechat";
import { Icon, Grid } from "anna-remax-ui";
import styles from "./index.less";

interface Data {
  name: string;
  icon: string;
  url: string;
}

/** 首页导航项数据 */

const data = [
  {
    name: "新闻",
    icon: "newshot",
    url: "../news/index",
  },
  {
    name: "活动",
    icon: "activity",
    url: "../activity/index",
  },
  {
    name: "检索",
    icon: "searchlist",
    url: "../search/index",
  },
  {
    name: "状态",
    icon: "circle",
    url: "../status/index",
  },
  {
    name: "关于",
    icon: "question",
    url: "../about/index",
  },
];

export default () => {
  /** Anna UI 的 Grid 的 children 渲染函数 */

  const renderGridItem = ({ name, icon, url }: Data) => (
    <View
      className={styles.grid_item}
      onClick={() => {
        navigateTo({ url: url });
      }}
    >
      <Icon type={icon} size="50px" />
      <Text>{name}</Text>
    </View>
  );

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        {/* 结果这里 image 不用 mode 还好看些 */}
        <Image src="../../sau.png" className={styles.logo} />
      </View>
      <View className={styles.grid_wrapper}>
        <Grid data={data} columns={3} gutter={[8, 8]}>
          {renderGridItem}
        </Grid>
      </View>
    </View>
  );
};
