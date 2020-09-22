import React, { useState, useEffect } from "react";
import { View } from "remax/wechat";
import { usePageEvent } from "remax/macro";
import { Filter, Card, Loading, SearchBar } from "anna-remax-ui";
import styles from "./index.less";

import DropButton from "@/components/DropButton";
import api from "@/utils/api";

interface Club {
  club_name: string;
  club_type_name: string; // 获取到的数据中有个 club_type 为数字，这里直接用字符串展示，不进行转换
  category_name: string; // 同样的，有个 category_id 可以在之后使用枚举对 类型 和 显示文字 进行改进
  club_info: string; // 社团信息文档下载
  expand: boolean; // 简略信息展开
  organization_name: string; // 挂靠单位不确定了，只因这里也有个 organization_id 就用它了
}

interface Result {
  data: {
    rows: Club[];
    total: number;
  };
}

// SAU 官网社团传值 学术性质：ct、社团类别：ci、社团名称：cn、翻页：pi
const ct = [
  {
    key: "-1",
    value: "全部",
  },
  {
    key: "1",
    value: "学术性",
  },
  {
    key: "0",
    value: "非学术性",
  },
];

const ci = [
  {
    key: "-1",
    value: "全部",
  },
  {
    key: "91",
    value: "企业俱乐部",
  },
  {
    key: "38",
    value: "实践类",
  },
  {
    key: "37",
    value: "艺术类",
  },
  {
    key: "36",
    value: "科技类",
  },
  {
    key: "35",
    value: "语言文化类",
  },
  {
    key: "34",
    value: "理论学习类",
  },
  {
    key: "33",
    value: "公益类",
  },
  {
    key: "61",
    value: "体育类",
  },
];
// 本来这个该是社团搜索页，该叫 club 的
export default () => {
  const [academic, setAcademic] = useState(ct[0].key);
  const [category, setCategory] = useState(ci[0].key);

  const [pageid, setPageid] = useState(1);
  const [total, setTotal] = useState(0); // 与分页有关
  const [clubList, setClubList] = useState<Club[]>([]);

  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [inputTxt, setInputTxt] = useState("");

  const getClub = async (load?: "more") => {
    setLoading(true);
    const res = await api.getClub({
      pi: pageid,
      ct: academic,
      ci: category,
      cn: searchName,
    });
    setTotal((res as Result).data.total);
    if (load) {
      setClubList(clubList.concat((res as Result).data.rows));
    } else {
      setClubList((res as Result).data.rows);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 加载下页，加载时不应管 搜索名、类型
    if (clubList.length < total) {
      getClub("more");
    }
  }, [pageid]);
  useEffect(() => {
    setClubList([]);
    setPageid(1);
    // 这里在修改 pi 之后强行进行一次请求，未免在第一页时修改下面三项，而 pi 并无差异，无法发起请求
    getClub();
  }, [searchName, academic, category]);

  usePageEvent("onLoad", () => {
    getClub();
  });
  usePageEvent("onReachBottom", () => {
    setPageid(pageid + 1);
  });

  return (
    <View className={styles.club}>
      <Filter>
        <Filter.Item
          title="学术类型"
          value={academic}
          options={ct}
          onChange={(e) => {
            setAcademic(e.key);
          }}
          activeColor="#FF903F"
        />
        <Filter.Item
          title="社团类别"
          value={category}
          options={ci}
          onChange={(e) => {
            setCategory(e.key);
          }}
          activeColor="#FF903F"
        />
      </Filter>
      {clubList.map((e, i) => (
        <Card shadow key={i} title={e.club_name} />
      ))}
      {loading && (
        <View className={styles.loading}>
          <Loading type="anna" color="#FF903F" />
        </View>
      )}
      <DropButton>
        <SearchBar
          value={searchName}
          placeholder={"社团名称"}
          keepShowActionButton
          actionName="搜索"
          shape="square"
          onInput={(e) => {
            setInputTxt(e);
          }}
          onActionClick={() => {
            if (inputTxt) {
              setSearchName(inputTxt);
            }
          }}
          onClear={() => {
            setSearchName("");
          }}
        />
      </DropButton>
    </View>
  );
};
