import { describe, expect, it } from 'vitest'
import { findProject, homepageProjects, nextProject, projects } from '../app/data/projects'
import { mangofairvisa, canvasWeb, starify, noteflow, zhangshangPuyuan } from '../app/data/projectDetails'

describe('project data', () => {
  it('contains six projects in the planned order', () => {
    expect(projects.map((project) => project.slug)).toEqual([
      'mangofairvisa',
      'canvas-web',
      'starify',
      'noteflow',
      'zhangshang-puyuan',
      'resume-tool'
    ])
  })

  it('shows four projects on the homepage in mango → canvas → starify → noteflow order', () => {
    expect(homepageProjects.map((project) => project.slug)).toEqual(['mangofairvisa', 'canvas-web', 'starify', 'noteflow'])
  })

  it('links the resume editor to the blog article', () => {
    const resume = findProject('resume-tool')
    expect(resume?.detail).toBe('https://www.zhoujump.com/blog/p/resume-tool-index/')
  })

  it('provides five dedicated detail pages', () => {
    const details = [mangofairvisa, canvasWeb, starify, noteflow, zhangshangPuyuan]
    expect(details.map((detail) => detail.zh.project.slug)).toEqual([
      'mangofairvisa',
      'canvas-web',
      'starify',
      'noteflow',
      'zhangshang-puyuan'
    ])
    expect(details.every((detail) => detail.zh.features.length === 3)).toBe(true)
    expect(details.every((detail) => detail.zh.gallery.length === 3)).toBe(true)
    expect(details.every((detail) => detail.en.features.length === 3)).toBe(true)
    expect(details.every((detail) => detail.en.gallery.length === 3)).toBe(true)
  })

  it('cycles to the next project', () => {
    expect(nextProject('noteflow').slug).toBe('zhangshang-puyuan')
    expect(nextProject('resume-tool').slug).toBe('mangofairvisa')
  })
})
