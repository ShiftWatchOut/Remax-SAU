import React, { useState, useEffect } from "react";
import { View } from "remax/wechat";
import { usePageEvent } from "remax/macro";
import { Loading, SearchBar, Card } from "anna-remax-ui";

import api from "@/utils/api";
import DropButton from "@/components/DropButton";
import styles from "./index.less";

type status = "未通过" | "通过" | "驳回";

interface ClubStatus {
  name: string;
  type: 0 | 1;
  link: string;
  colStat: status;
  sauStat: status;
}

interface ListResult {
  data: ClubStatus[];
}

export default () => {
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState<ClubStatus[]>([]);
  const [status, setStatus] = useState("");
  const [pageId, setPageId] = useState(0);
  const [searchName, setSearchName] = useState("");

  const [inputTxt, setInputTxt] = useState("");

  const [clubId, setClubId] = useState("");

  const getStatusList = async (load?: "more") => {
    setLoading(true);
    const res = await api.getStatus({
      clubname: searchName,
      status,
      pageid: pageId,
    });
    if (load) {
      setStatusList(statusList.concat((res as ListResult).data));
    } else {
      setStatusList((res as ListResult).data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getStatusList('more');
  }, [pageId]);

  usePageEvent("onLoad", () => {
    getStatusList();
  });
  usePageEvent("onReachBottom", () => {
    setPageId(pageId + 1);
  });

  return (
    <View className={styles.status}>
      {statusList.map((e, i) => (
        <Card key={i} title={e.name} />
      ))}
      {loading && (
        <View className={styles.loading}>
          <Loading type="anna" color="#FF903F" />
        </View>
      )}
    </View>
  );
};
