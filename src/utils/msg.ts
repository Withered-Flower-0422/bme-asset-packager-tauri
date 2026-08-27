import { message } from "antd"

export const warning = (content: string) => {
  message.destroy()
  message.warning({
    content,
    onClick: () => message.destroy(),
  })
}

export const success = (content: string) => {
  message.destroy()
  message.success({
    content,
    onClick: () => message.destroy(),
  })
}
