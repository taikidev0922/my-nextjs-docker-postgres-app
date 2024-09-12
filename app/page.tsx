"use client";
import React from "react";
import { DashboardCard } from "../presentation/shared/DashboardCard";
import { Users, Package, FileText, List, Info } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            受注管理アプリ
          </h1>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-semibold">
            <Info className="w-4 h-4 mr-2" />
            ポートフォリオ用サンプルアプリ
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            title="得意先管理"
            description="顧客情報の登録・編集・閲覧が可能です。"
            icon={Users}
            href="/customers"
          />
          <DashboardCard
            title="商品管理"
            description="商品の登録・編集・在庫管理を一括で行えます。"
            icon={Package}
            href="/products"
          />
          <DashboardCard
            title="受注入力"
            description="新規受注の登録と編集を簡単に行えます。"
            icon={FileText}
            href="/orders/new"
          />
          <DashboardCard
            title="受注一覧"
            description="全ての受注情報を一覧で確認・管理できます。"
            icon={List}
            href="/orders"
          />
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md flex items-start">
          <Info className="h-6 w-6 mr-4 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">
              このアプリは架空の受注管理システムです。
            </p>
            <p className="mt-1">
              登録や削除など自由に操作しても問題ありません。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
