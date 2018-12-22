// @flow
import filter from "./filter"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"
import FilterModel from "../../models/filter"

import { todos } from "../../test/test_helper"

it("a blank filter will return all todos", () => {
  const filterModel = new FilterModel({})

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(6)
})

it("filters by project", () => {
  const filterModel = new FilterModel({ projects: ["bigProject"] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].projects).toEqual(["bigProject"])
})

it("filters by todos with no project", () => {
  const filterModel = new FilterModel({ projects: [] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(5)
})

it("filters by context", () => {
  const filterModel = new FilterModel({ contexts: ["Nick"] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(2)
  expect(filtered[0].contexts).toEqual(["Nick"])
})

it("filters by todos with no context", () => {
  const filterModel = new FilterModel({ contexts: [] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(2)
})

it("filters by subject", () => {
  const filterModel = new FilterModel({ subjectContains: "presentation" })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(6)
})

it("filters by subject, ignores case", () => {
  const filterModel = new FilterModel({ subjectContains: "Presentation" })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(6)
})

it("filters by archived", () => {
  const filterModel = new FilterModel({ archived: true })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(5)
  expect(filtered[0].archived).toBeTruthy()
})

it("filters by priority", () => {
  const filterModel = new FilterModel({ isPriority: true })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(0)
})

it("filters by completed", () => {
  const filterModel = new FilterModel({ completed: true })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(2)
  expect(filtered.map(f => f.id)).toEqual([4,5])
})

it("filters by priority or completed", () => {
  const filterModel = new FilterModel({ isPriority: true, completed: true })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(0)
})

it("filters by subject and contexts", () => {
  const filterModel = new FilterModel({ subjectContains: "presentation", contexts: ["dingle"] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(0)
})

it("filters by subject and contexts right contexts", () => {
  const filterModel = new FilterModel({ subjectContains: "presentation", contexts: ["Nick"] })

  const filtered = filter(todos, filterModel)

  expect(filtered.length).toEqual(1)
})


