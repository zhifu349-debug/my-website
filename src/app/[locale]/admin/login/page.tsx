'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { userStore } from '@/lib/data/user-store'

export default function AdminLoginPage() {

  const router = useRouter()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 获取客户端信息
      const ipAddress = await getClientIp()
      const userAgent = navigator.userAgent

      // 验证凭证
      const user = userStore.getUserByUsername(username)
      
      if (user && user.password === password && user.status === 'active') {
        // 更新最后登录时间
        userStore.updateLastLogin(user.id)
        
        // 记录登录成功历史
        userStore.addLoginHistory({
          userId: user.id,
          timestamp: new Date().toISOString(),
          ipAddress,
          userAgent,
          status: 'success'
        })

        // 生成并存储token
        const token = btoa(`${username}:${Date.now()}`)
        localStorage.setItem('adminToken', token)
        localStorage.setItem('currentUser', JSON.stringify({ id: user.id, username: user.username, role: user.role }))
        
        // 登录成功，重定向到管理后台
        router.push('/zh/admin')
      } else {
        // 记录登录失败历史
        const existingUser = userStore.getUserByUsername(username)
        if (existingUser) {
          userStore.addLoginHistory({
            userId: existingUser.id,
            timestamp: new Date().toISOString(),
            ipAddress: await getClientIp(),
            userAgent: navigator.userAgent,
            status: 'failed',
            errorMessage: '密码错误'
          })
        }
        setError('用户名或密码错误')
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取客户端IP地址（模拟）
  const getClientIp = async (): Promise<string> => {
    try {
      // 在实际生产环境中，应该从服务器获取真实IP
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return '127.0.0.1'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            管理后台登录
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            请输入管理员凭证
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>默认凭证：admin / admin123</p>
            <p className="mt-1">生产环境请修改默认凭证</p>
          </div>
        </form>
      </div>
    </div>
  )
}