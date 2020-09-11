import React, { useState, useEffect } from "react";
import { View, Image } from "remax/wechat";
import { usePageEvent } from "remax/macro";
import { useNativeEffect } from "remax";
import styles from "./index.less";
import { Loading, Card, Popup } from "anna-remax-ui";

import api from "@/utils/api";

interface NewsLi {
  id: string;
  title: string;
  time: string;
}

interface NewsContent {
  tag: "span" | "img";
  text: string;
}

interface ContentResult {
  data: NewsContent[];
}

interface ListResult {
  data: NewsLi[];
}

export default () => {
  // 新闻列表
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsLi[]>([]);
  const [pageId, setPageId] = useState(1);
  const [noData, setNoData] = useState(false);
  // 新闻内容
  const [newsContentShow, setNewsContentShow] = useState(false);
  const [newsContentLoading, setNewsContentLoading] = useState(false);
  const [newsId, setNewsId] = useState("");
  const [newsDetail, setNewsDetail] = useState<NewsContent[]>([]);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsTime, setNewsTime] = useState("");

  /** 加载特定页数据 */

  const getNewsList = async () => {
    setLoading(true);
    const res = await api.getNewsList({ page: pageId });
    setNewsList(newsList.concat((res as ListResult).data));
    setLoading(false);
  };

  /** 加载指定id新闻内容 */

  const getNewsDetail = async () => {
    setNewsDetail([]);
    setNewsContentLoading(true);
    const res = await api.getNewsDetail({ newsid: newsId });
    setNewsDetail((res as ContentResult).data);
    setNewsContentLoading(false);
  };

  /** 设置新闻 id 标题 时间 */
  const renderNews = (news: NewsLi) => {
    setNewsId(news.id);
    setNewsTime(news.time);
    setNewsTitle(news.title);
  };

  usePageEvent("onLoad", () => {
    getNewsList();
  });
  usePageEvent("onReachBottom", () => {
    if (loading) return;
    // 往后翻页 时间 错乱，是社团联网站本身的失误
    setPageId(pageId + 1);
  });
  // React 取到了设置后的 newsList 而 Native 却没有

  useEffect(() => {
    if (!newsId) return;
    getNewsDetail();
  }, [newsId]);
  useEffect(() => {
    getNewsList();
  }, [pageId]);
  return (
    <View className={styles.news}>
      {newsList.map((e, i) => (
        <Card
          shadow
          title={e.title}
          description={e.time}
          key={e.id + i.toString()}
          onTap={() => {
            renderNews(e);
            setNewsContentShow(true);
          }}
        />
      ))}
      {loading && (
        <View className={styles.loading}>
          <Loading type="anna" color="#FF903F" />
        </View>
      )}
      <Popup
        open={newsContentShow}
        onClose={() => {
          setNewsContentShow(false);
        }}
        position="bottom"
        closeable
      >
        <View className={styles.popup}>
          <View className={styles.news_title}>{newsTitle}</View>
          <View className={styles.news_time}>{newsTime}</View>
          {newsContentLoading && (
            <View className={styles.loading}>
              <Loading type="anna" color="#FF903F" />
            </View>
          )}
          {/* newsDetail 在页面中初始为 null 而非 [] */}
          <View className={styles.news_detail}>
            {newsDetail &&
              newsDetail.map((e, i) => {
                return e.tag == "img" ? (
                  <Image src={e.text} key={i} />
                ) : (
                  <View key={i}>{e.text} </View>
                );
              })}
          </View>
        </View>
      </Popup>
      <Popup
        open={noData}
        onClose={() => {
          setNoData(false);
        }}
      >
        <View style={{ padding: "40rpx" }}>No more data!</View>
      </Popup>
    </View>
  );
};
