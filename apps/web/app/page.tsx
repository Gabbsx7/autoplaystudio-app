import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirecionar direto para o dashboard por enquanto
  redirect('/dashboard/client')
}
