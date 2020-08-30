import * as React from "react";
import { View, cloud, Image, Text } from "remax/wechat";
import { usePageEvent } from "remax/macro";
import { useNativeEffect } from "remax";
import styles from "./index.less";
import { Loading, Card, Popup } from "anna-remax-ui";

interface NewsLi {
  id: string;
  title: string;
  time: string;
}

interface NewsContent {
  tag: "span" | "img";
  text: string;
}

export default () => {
  // 新闻列表
  const [loading, setLoading] = React.useState(true);
  const [newsList, setNewsList] = React.useState<NewsLi[]>([]);
  const [pageId, setPageId] = React.useState(1);
  const [noData, setNoData] = React.useState(false);
  // 新闻内容
  const [newsContentShow, setNewsContentShow] = React.useState(false);
  const [newsContentLoading, setNewsContentLoading] = React.useState(false);
  const [newsId, setNewsId] = React.useState("");
  const [newsDetail, setNewsDetail] = React.useState<NewsContent[]>([]);
  const [newsTitle, setNewsTitle] = React.useState("");
  const [newsTime, setNewsTime] = React.useState("");

  /** 加载特定页数据 */

  const loadPage = () => {
    setLoading(true);
    cloud.callFunction({
      name: "newsList",
      data: {
        query: { pageid: pageId },
      },
      success: (res: { result: NewsLi[] }) => {
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

  /** 加载指定id新闻内容 */

  const loadNewsContent = () => {
    setNewsContentLoading(true);
    cloud.callFunction({
      name: "newsContents",
      data: {
        query: { newsid: newsId },
      },
      success: (res: { result: NewsContent[] }) => {
        console.log(res);
        setNewsDetail(res.result);
        setNewsContentLoading(false);
      },
    });
  };
  /** 设置新闻 id 标题 时间 */
  const renderNews = (news: NewsLi) => {
    setNewsId(news.id);
    setNewsTime(news.time);
    setNewsTitle(news.title);
  };

  usePageEvent("onLoad", () => {
    loadPage();
  });
  usePageEvent("onReachBottom", () => {
    // 往后翻页时间错乱，是社团联网站本身的失误
    setPageId(pageId + 1);
    loadPage();
  });
  // React 取到了设置后的 newsList 而 Native 却没有

  useNativeEffect(() => {
    setNewsDetail([]);
    loadNewsContent();
  }, [newsId]);

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
        <View
          style={{
            height: "1000rpx",
            padding: "80rpx 24rpx",
            overflow: "scroll",
            fontSize: "28rpx",
          }}
        >
          <View style={{ fontSize: "44rpx" }}>{newsTitle}</View>
          <View style={{ color: "gray", fontSize: "24rpx", marginBottom: '30rpx' }}>{newsTime}</View>
          {newsContentLoading && (
            <View className={styles.loading}>
              <Loading type="anna" color="#FF903F" />
            </View>
          )}
          {/* newsDetail 在页面中初始为 null 而非 [] */}
          {newsDetail &&
            newsDetail.map((e, i) => {
              return e.tag == "img" ? (
                <Image src={e.text} key={i} />
              ) : (
                <View key={i}>{e.text} </View>
              );
            })}
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
