import * as React from "react";
import { View, cloud } from "remax/wechat";
import { usePageEvent } from "remax/macro";
import styles from "./index.less";
import { Loading, Card, Popup } from "anna-remax-ui";

interface News {
  id: string;
  title: string;
  time: string;
}

export default () => {
  const [loading, setLoading] = React.useState(true);
  const [newsList, setNewsList] = React.useState<News[]>([]);
  const [pageId, setPageId] = React.useState(1);
  const [noData, setNoData] = React.useState(false);

  /** 加载特定页数据 */

  const loadPage = (pageId: number) => {
    setLoading(true);
    cloud.callFunction({
      name: "newsList",
      data: {
        query: { pageid: pageId },
      },
      success: (res: { result: News[] }) => {
        if (newsList.some((e) => e.id === res.result[0].id)) {
          // 照理来说这个 popup 平时不该弹出来
          setNoData(true);
          setLoading(false);
          return;
        }
        if (res.result.length !== 0) {
          setLoading(false);
        }
        setNewsList(newsList.concat(res.result));
      },
    });
  };

  usePageEvent("onLoad", () => {
    loadPage(pageId);
  });
  usePageEvent("onReachBottom", () => {
    // 往后翻页时间错乱，是社团联网站本身的失误
    setPageId(pageId + 1);
    loadPage(pageId);
  });
  // React 取到了设置后的 newsList 而 Native 却没有
  React.useEffect(() => {
    console.log("React", newsList);
  }, [newsList]);
  return (
    <View className={styles.news}>
      {newsList.map((e, i) => (
        <Card
          shadow
          title={e.title}
          description={e.time}
          key={e.id + i.toString()}
        />
      ))}
      {loading && (
        <View className={styles.loading}>
          <Loading type="anna" color="#FF903F" />
        </View>
      )}
      <Popup
        open={noData}
        onClose={() => {
          setNoData(false);
        }}
      >
        <View style={{ padding: "40px" }}>No more data!</View>
      </Popup>
    </View>
  );
};
