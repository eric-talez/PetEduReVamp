import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CourseCard } from '@/components/ui/CourseCard'

describe('CourseCard', () => {
  const mockCourse = {
    image: 'https://example.com/image.jpg',
    title: '테스트 강의',
    description: '테스트 강의 설명입니다.',
    badge: { text: '인기', variant: 'accent' },
    trainer: { 
      image: 'https://example.com/trainer.jpg', 
      name: '김훈련사' 
    },
    status: '진행 중',
    progress: 65
  }

  it('강의 정보를 올바르게 렌더링한다', () => {
    render(<CourseCard {...mockCourse} />)
    
    expect(screen.getByText('테스트 강의')).toBeInTheDocument()
    expect(screen.getByText('테스트 강의 설명입니다.')).toBeInTheDocument()
    expect(screen.getByText('인기')).toBeInTheDocument()
    expect(screen.getByText('김훈련사')).toBeInTheDocument()
    expect(screen.getByText('상태: 진행 중')).toBeInTheDocument()
    expect(screen.getByText('진행률')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('클릭 이벤트가 올바르게 작동한다', () => {
    const handleClick = vi.fn()
    render(<CourseCard {...mockCourse} onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('테스트 강의'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('선택적 프로퍼티들이 없어도 렌더링된다', () => {
    const minimalCourse = {
      image: 'https://example.com/image.jpg',
      title: '최소 강의',
      description: '최소 설명'
    }
    
    render(<CourseCard {...minimalCourse} />)
    
    expect(screen.getByText('최소 강의')).toBeInTheDocument()
    expect(screen.getByText('최소 설명')).toBeInTheDocument()
    expect(screen.queryByText('진행률')).not.toBeInTheDocument()
  })
})