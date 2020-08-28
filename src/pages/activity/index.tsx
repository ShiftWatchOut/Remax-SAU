import * as React from "react";
import { View, cloud } from "remax/wechat";
import styles from "./index.less";
import { Loading, Card, Popup } from "anna-remax-ui";
import { usePageEvent } from "remax/macro";

interface Event {
  event: string;
  time: string;
  place: string;
  describe: string;
}

export default () => {
  const [loading, setLoading] = React.useState(true);
  const [preList, setPreList] = React.useState<Event[]>([]);
  const [pageId, setPageId] = React.useState(1);
  const [noData, setNoData] = React.useState(false);

  /** 加载特定页数据 */

  const loadPage = () => {
    setLoading(true);
    cloud.callFunction({
      name: "preList",
      data: {
        query: { pageid: pageId },
      },
      success(res: { result: Event[] }) {
        // TODO: 函数抽离出去时如何根据各自的字段判断重复？
        if (preList.some((e) => e.event === res.result[0].event)) {
          // 照理来说这个 popup 平时不该弹出来
          // TMD 这一页的云函数有个只返回pageid=1的 碧油鸡
          setNoData(true);
          setLoading(false);
          return;
        }
        if (res.result.length !== 0) {
          setLoading(false);
        }
        console.log(res);
        setPreList(preList.concat(res.result));
      },
      complete(e: any) {
        console.log('any',e);
      },
    });
  };
  usePageEvent('onLoad', () => {
    loadPage()
  });
  usePageEvent("onReachBottom", () => {
    setPageId(pageId + 1);
    loadPage();
  });
  return (
    <View className={styles.pre}>
      {preList.map((e, i) => (
        <Card
          shadow
          key={e.event + e.time}
          title={e.event}
          description={`${e.place} ${e.describe}`}
          extra={e.time}
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
