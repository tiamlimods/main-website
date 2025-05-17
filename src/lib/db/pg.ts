// 导入postgres库
import postgres from 'postgres'

// 创建PostgreSQL连接实例
// 使用环境变量中的独立配置项
const sql = postgres({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  username: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  max: 20,
  idle_timeout: 30,
  connect_timeout: 30
})

// 通用查询函数
// T: 指定返回结果的类型约束(只读的对象数组或undefined数组)
// strings: SQL模板字符串
// values: 查询参数值(支持string, number, boolean, null)
export async function query<T extends readonly (object | undefined)[]>(
  strings: TemplateStringsArray,
  ...values: (string | number | boolean | null)[]
): Promise<T> {
  return (await sql<T>(strings, ...values)) as unknown as Promise<T>
}

// 关闭数据库连接
export async function end() {
  await sql.end()
}

// 默认导出sql连接实例
export default sql