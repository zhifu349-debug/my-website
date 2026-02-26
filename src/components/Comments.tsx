"use client";

import { useEffect, useRef, useState } from "react";
import { init, type WalineInstance } from "@waline/client";
import "@waline/client/style";

interface CommentsProps {
  path: string;
  locale?: "en" | "zh";
}

export default function Comments({ path, locale = "zh" }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const walineRef = useRef<WalineInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const serverURL = process.env.NEXT_PUBLIC_WALINE_SERVER_URL;

    if (!serverURL || !containerRef.current) {
      return;
    }

    // 清理旧实例
    if (walineRef.current) {
      walineRef.current.destroy();
    }

    // 初始化 Waline
    walineRef.current = init({
      el: containerRef.current,
      serverURL,
      path,
      lang: locale,
      dark: "auto",
      requiredMeta: ["nick", "mail"],
      login: "enable",
      wordLimit: [5, 1000],
      pageSize: 10,
      locale: {
        zh: {
          nick: "昵称",
          nickError: "昵称不能少于3个字符",
          mail: "邮箱",
          mailError: "请填写正确的邮件地址",
          link: "网站",
          placeholder: "欢迎评论...",
          sofa: "来发评论吧~",
          submit: "提交",
          reply: "回复",
          cancelReply: "取消回复",
          comment: "评论",
          refresh: "刷新",
          more: "加载更多...",
          preview: "预览",
          emoji: "表情",
          uploadImage: "上传图片",
          seconds: "秒前",
          minutes: "分钟前",
          hours: "小时前",
          days: "天前",
          now: "刚刚",
          uploading: "正在上传",
          login: "登录",
          logout: "退出",
          admin: "博主",
          sticky: "置顶",
          word: "字",
          wordHint: "评论字数应在 $0 到 $1 字之间！\n当前字数：$2",
          anonymous: "匿名",
        },
        en: {
          nick: "Nickname",
          nickError: "Nickname must be at least 3 characters",
          mail: "Email",
          mailError: "Please enter a valid email address",
          link: "Website",
          placeholder: "Welcome to comment...",
          sofa: "No comments yet, be the first!",
          submit: "Submit",
          reply: "Reply",
          cancelReply: "Cancel Reply",
          comment: "Comment",
          refresh: "Refresh",
          more: "Load More...",
          preview: "Preview",
          emoji: "Emoji",
          uploadImage: "Upload Image",
          seconds: "seconds ago",
          minutes: "minutes ago",
          hours: "hours ago",
          days: "days ago",
          now: "just now",
          uploading: "Uploading",
          login: "Login",
          logout: "Logout",
          admin: "Admin",
          sticky: "Sticky",
          word: "words",
          wordHint: "Comment must be between $0 and $1 words!\nCurrent: $2",
          anonymous: "Anonymous",
        },
      },
      // 启用邮件通知
      notification: {
        enable: true,
      },
      // 支持 Markdown
      highlighter: true,
      // 支持 Math 公式
      texRenderer: false,
    });

    setIsLoaded(true);

    return () => {
      if (walineRef.current) {
        walineRef.current.destroy();
        walineRef.current = null;
      }
    };
  }, [path, locale]);

  const serverURL = process.env.NEXT_PUBLIC_WALINE_SERVER_URL;

  if (!serverURL) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          {locale === "zh"
            ? "💬 评论功能尚未配置"
            : "💬 Comments are not configured"}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {locale === "zh"
            ? "请设置 NEXT_PUBLIC_WALINE_SERVER_URL 环境变量"
            : "Please set NEXT_PUBLIC_WALINE_SERVER_URL environment variable"}
        </p>
      </div>
    );
  }

  return (
    <div className="comments-container mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">💬</span>
        {locale === "zh" ? "评论区" : "Comments"}
      </h3>
      <div
        ref={containerRef}
        className="waline-container"
        style={{ minHeight: isLoaded ? "auto" : "200px" }}
      />
      {!isLoaded && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
