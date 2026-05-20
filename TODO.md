# TODO - AI Project Management System (SSR + TypeScript + MongoDB + Socket.io)

## Giai đoạn 1 — Chuẩn hoá TS + clean structure (không đổi logic domain ngay)
- [x] Tạo folder structure `src/` theo spec (config/constants/controllers/services/repositories/models/interfaces/middlewares/routes/validations/sockets/helpers/utils/views/public/types/modules)
- [x] Tạo `src/app.ts` (Express SSR: Pug, static, session/flash, view locals, register routes)
- [x] Tạo `src/server.ts` (http server + socket.io + listen)

- [x] Tạo `tsconfig.json` chuẩn + path alias
- [x] Tạo `eslint` + `prettier` config
- [ ] Cập nhật `package.json` scripts: `dev`, `build`, `start`
- [x] Tạo types `types/express.d.ts` để type `res.locals` phục vụ SSR (migration helpers)


## Giai đoạn 2 — Convert Auth + RBAC sang TS (giữ logic)
- [ ] Convert `controllers/admin/auth.controller.js` -> TS
- [ ] Convert `middlewares/admin/auth.middleware.js` -> TS
- [ ] Convert `models/account.model.js`, `models/role.model.js` -> TS models
- [ ] Chuẩn hoá RBAC middleware: `requireAuth`, `requirePermission`
- [ ] Thêm validation DTO cho auth/input bodies
- [ ] Global error handler tối thiểu (nếu cần)

## Giai đoạn 3 — Domain migration (E-commerce -> AI Project Management)
- [ ] Thiết kế lại Mongoose collections theo yêu cầu
- [ ] Refactor admin modules: dashboard/projects/tasks/roles/accounts/settings
- [ ] Refactor sockets theo project/task + realtime notifications
- [ ] Refactor client pages theo project/task/discussion/chat

## Giai đoạn 4 — Pug UI redesign (admin/client)
- [ ] Layout sidebar/header + dark mode
- [ ] Trang dashboard + project overview + kanban/tasks + analytics/report
- [ ] Modal/form/table responsive

## Giai đoạn 5 — Bonus (sau core)
- [ ] Activity timeline, audit logs
- [ ] Rate limiting
- [ ] Pagination/search/filter chuẩn cho lists
- [ ] Swagger (tuỳ chọn)

