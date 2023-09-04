import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().min(2).max(50),
  password: z.string().min(2), // TODO: Change to 8
})

export default formSchema
