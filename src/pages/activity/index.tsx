import React, { useState, useEffect } from "react";
import { View } from "remax/wechat";
import styles from "./index.less";
import { Loading, Card, Popup } from "anna-remax-ui";
import { usePageEvent } from "remax/macro";

import api from "@/utils/api";

interface Event {
  event: string;
  time: string;
  place: string;
  describe: string;
}

interface Result {
  data: Event[];
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [preList, setPreList] = useState<Event[]>([]);
  const [pageId, setPageId] = useState(1);
  const [noData, setNoData] = useState(false);

  /** 加载特定页数据 */

  const getActivities = async () => {
    setLoading(true);
    const res = await api.getActivities({
      page: pageId,
    });
    setPreList(preList.concat((res as Result).data));
    setLoading(false);
  };

  useEffect(() => {
    getActivities();
  }, [pageId]);

  usePageEvent("onLoad", () => {
    getActivities();
  });
  usePageEvent("onReachBottom", () => {
    if (!loading) {
      setPageId(pageId + 1);
    }
  });
  return (
    <View className={styles.pre}>
      {preList.map((e, i) => (
        <Card
          shadow
          key={e.event + i}
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
