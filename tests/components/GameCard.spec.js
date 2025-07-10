import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameCard from '../../src/components/GameCard.vue'

describe('GameCard', () => {
  it('renders game information correctly', () => {
    const game = {
      id: 1,
      name: 'Test Game',
      image: 'test.jpg',
      description: 'Test description',
      price: 10000
    }

    const wrapper = mount(GameCard, {
      props: { game }
    })

    expect(wrapper.text()).toContain(game.name)
    expect(wrapper.text()).toContain(game.description)
    expect(wrapper.text()).toContain(game.price.toLocaleString())
    expect(wrapper.find('img').attributes('src')).toBe(game.image)
  })

  it('shows manage button for admin', async () => {
    const game = {
      id: 1,
      name: 'Test Game',
      image: 'test.jpg',
      description: 'Test description',
      price: 10000
    }

    const wrapper = mount(GameCard, {
      props: { game },
      global: {
        mocks: {
          $store: {
            state: {
              auth: {
                user: {
                  role: 'admin'
                }
              }
            }
          }
        }
      }
    })

    expect(wrapper.find('.btn-secondary').exists()).toBe(true)
    expect(wrapper.find('.btn-secondary').text()).toBe('Manage')
  })
})