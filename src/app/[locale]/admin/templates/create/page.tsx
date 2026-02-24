// 创建模板页面

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredLocale as getLocale } from '@/lib/i18n';
// import { any, any } from '@/lib/cms-types';

export default function CreateTemplatePage() {
  const router = useRouter();
  const locale = getLocale();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'recommendation' as const,
    variables: [] as any[],
    structure: {
      sections: [] as any[],
    } as any,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (section: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVariable = () => (section: any) => {
    const newVariable: any = {
      id: `var-${Date.now()}`,
      name: '',
      type: 'text',
      label: { en: '', zh: '' },
      required: false,
    };
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable],
    }));
  };

  const handleUpdateVariable = (index: number, updates: Partial<any>) => (section: any) => {
    const updatedVariables = [...formData.variables];
    updatedVariables[index] = { ...updatedVariables[index], ...updates };
    setFormData(prev => ({
      ...prev,
      variables: updatedVariables,
    }));
  };

  const handleRemoveVariable = (index: number) => (section: any) => {
    const updatedVariables = formData.variables.filter((_, i) => (i: any) => i !== index);
    setFormData(prev => ({
      ...prev,
      variables: updatedVariables,
    }));
  };

  const handleAddSection = () => (section: any) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: 'text',
      content: { en: '', zh: '' },
      order: formData.structure.sections.length + 1,
    };
    setFormData(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        sections: [...prev.structure.sections, newSection],
      },
    }));
  };

  const handleUpdateSection = (index: number, updates: any) => (section: any) => {
    const updatedSections = [...formData.structure.sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };
    setFormData(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        sections: updatedSections,
      },
    }));
  };

  const handleRemoveSection = (index: number) => {
    const updatedSections = formData.structure.sections.filter((_: any, i: any) => i !== index);
    // 更新顺序
    updatedSections.forEach((section: any, i: any) => {
      section.order = i + 1;
    });
    setFormData(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        sections: updatedSections,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/${locale}/admin/templates`);
      } else {
        throw new Error('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">创建模板</h1>
        <button
          onClick={() => router.push(`/${locale}/admin/templates`)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          返回
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              模板名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              模板类型 <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="recommendation">推荐</option>
              <option value="review">评测</option>
              <option value="comparison">对比</option>
              <option value="tutorial">教程</option>
              <option value="resource">资源</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            模板描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">变量定义</h2>
            <button
              type="button"
              onClick={handleAddVariable}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              添加变量
            </button>
          </div>

          {formData.variables.map((variable, index) => (
            <div key={variable.id} className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">变量 #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveVariable(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">变量名</label>
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => handleUpdateVariable(index, { name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">变量类型</label>
                  <select
                    value={variable.type}
                    onChange={(e) => handleUpdateVariable(index, { type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="text">文本</option>
                    <option value="number">数字</option>
                    <option value="boolean">布尔值</option>
                    <option value="select">选择</option>
                    <option value="image">图片</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">标签 (英文)</label>
                  <input
                    type="text"
                    value={variable.label.en}
                    onChange={(e) => handleUpdateVariable(index, { label: { ...variable.label, en: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">标签 (中文)</label>
                  <input
                    type="text"
                    value={variable.label.zh}
                    onChange={(e) => handleUpdateVariable(index, { label: { ...variable.label, zh: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={variable.required}
                  onChange={(e) => handleUpdateVariable(index, { required: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700">必填</label>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">模板结构</h2>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              添加区块
            </button>
          </div>

          {formData.structure.sections.map((section, index) => (
            <div key={section.id} className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">区块 #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveSection(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">区块类型</label>
                <select
                  value={section.type}
                  onChange={(e) => handleUpdateSection(index, { type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="title">标题</option>
                  <option value="intro">介绍</option>
                  <option value="text">文本</option>
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                  <option value="comparison-table">对比表格</option>
                  <option value="seo-title">SEO标题</option>
                  <option value="seo-description">SEO描述</option>
                  <option value="seo-keywords">SEO关键词</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">内容 (英文)</label>
                  <textarea
                    value={section.content.en}
                    onChange={(e) => handleUpdateSection(index, { content: { ...section.content, en: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">使用 {'{{variableName}}'} 插入变量</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">内容 (中文)</label>
                  <textarea
                    value={section.content.zh}
                    onChange={(e) => handleUpdateSection(index, { content: { ...section.content, zh: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">使用 {'{{variableName}}'} 插入变量</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/templates`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? '创建中...' : '创建模板'}
          </button>
        </div>
      </form>
    </div>
  );
}
