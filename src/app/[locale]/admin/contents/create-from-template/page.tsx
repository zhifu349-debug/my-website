// 从模板创建内容页面

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredLocale as getLocale } from '@/lib/i18n';
// TODO: Add proper Template type definition
// import { Template, TemplateVariable } from '@/lib/cms-types';
import { templateEngine } from '@/lib/template-engine';

export default function CreateContentFromTemplatePage() {
  const router = useRouter();
  const locale = getLocale();

  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
    setVariables({});
    setPreview(null);
  };

  const handleVariableChange = (name: string, value: any) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = async () => {
    if (!selectedTemplate) return;

    try {
      setPreviewLoading(true);
      const response = await fetch(`/api/templates/${selectedTemplate.id}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variables }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data);
      } else {
        throw new Error('Failed to preview template');
      }
    } catch (error) {
      console.error('Error previewing template:', error);
      alert('Failed to preview template. Please try again.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCreateContent = async () => {
    if (!selectedTemplate) return;

    try {
      setCreating(true);
      // 首先创建模板实例
      const instanceResponse = await fetch('/api/template-instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          variables,
        }),
      });

      if (!instanceResponse.ok) {
        throw new Error('Failed to create template instance');
      }

      const instance = await instanceResponse.json();

      // 从模板实例创建内容
      const contentResponse = await fetch(`/api/template-instances/${instance.id}`, {
        method: 'POST',
      });

      if (contentResponse.ok) {
        const content = await contentResponse.json();
        router.push(`/${locale}/admin/contents/edit/${content.id}`);
      } else {
        throw new Error('Failed to create content from template');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">从模板创建内容</h1>
        <button
          onClick={() => router.push(`/${locale}/admin/contents`)} 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          返回
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">选择模板</label>
          <select
            onChange={handleTemplateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- 选择模板 --</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.type})
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">填写变量</h2>
            {selectedTemplate.variables.map((variable: any) => (
              <div key={variable.id} className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {variable.label[locale]} {variable.required && <span className="text-red-500">*</span>}
                </label>
                {variable.type === 'text' && (
                  <input
                    type="text"
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required={variable.required}
                  />
                )}
                {variable.type === 'number' && (
                  <input
                    type="number"
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(variable.name, parseFloat(e.target.value) || '')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required={variable.required}
                  />
                )}
                {variable.type === 'boolean' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variables[variable.name] || false}
                      onChange={(e) => handleVariableChange(variable.name, e.target.checked)}
                      className="mr-2"
                    />
                    <label>{variable.label[locale]}</label>
                  </div>
                )}
                {variable.type === 'select' && variable.options && (
                  <select
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required={variable.required}
                  >
                    <option value="">-- 选择 --</option>
                    {variable.options.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label[locale]}
                      </option>
                    ))}
                  </select>
                )}
                {variable.type === 'image' && (
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required={variable.required}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTemplate && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {previewLoading ? '预览中...' : '预览'}
            </button>
            <button
              onClick={handleCreateContent}
              disabled={creating}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {creating ? '创建中...' : '创建内容'}
            </button>
          </div>
        )}

        {preview && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">预览</h2>
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-2">{preview.title[locale]}</h3>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">SEO信息</h4>
                <p className="text-sm">{preview.seo.title[locale]}</p>
                <p className="text-sm text-gray-600">{preview.seo.description[locale]}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">介绍</h4>
                <p>{preview.content[locale].intro}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">内容区块</h4>
                {preview.content[locale].sections.map((section: any, index: number) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm font-medium">{section.type}</p>
                    <div className="pl-4 border-l-2 border-gray-200">
                      {typeof section.content === 'string' ? (
                        <p>{section.content}</p>
                      ) : (
                        <p>{section.content[locale]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
