import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/pages/Home'

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: () => ['/'],
  Link: ({ children, href }: any) => <a href={href}>{children}</a>
}))

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    userRole: null,
    userName: null
  })
}))

vi.mock('@/components/RealTimePopularChart', () => ({
  default: () => <div data-testid="popular-chart">Popular Chart</div>
}))

vi.mock('@/components/ShopPreview', () => ({
  default: () => <div data-testid="shop-preview">Shop Preview</div>
}))

describe('Home Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('메인 페이지가 올바르게 렌더링된다', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText(/우리의 서비스/)).toBeInTheDocument()
    expect(screen.getByText(/교육 프로그램/)).toBeInTheDocument()
    expect(screen.getByText(/전문 트레이너/)).toBeInTheDocument()
    expect(screen.getByText(/온라인 화상 교육/)).toBeInTheDocument()
  })

  it('서비스 카드들이 올바른 링크를 가진다', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText('프로그램 보기').closest('a')).toHaveAttribute('href', '/courses')
    expect(screen.getByText('트레이너 찾기').closest('a')).toHaveAttribute('href', '/trainers')
    expect(screen.getByText('화상 교육 체험하기').closest('a')).toHaveAttribute('href', '/video-call')
  })

  it('필수 컴포넌트들이 렌더링된다', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByTestId('popular-chart')).toBeInTheDocument()
    expect(screen.getByTestId('shop-preview')).toBeInTheDocument()
  })
})