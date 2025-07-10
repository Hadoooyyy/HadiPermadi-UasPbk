import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../../src/views/Home.vue'
import { createPinia } from 'pinia'

describe('Home View', () => {
  it('renders properly', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.text()).toContain('Welcome to GameTopup')
    expect(wrapper.text()).toContain('Popular Games')
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [createPinia()],
        mocks: {
          $store: {
            state: {
              game: {
                loading: true
              }
            }
          }
        }
      }
    })

    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true)
  })
})