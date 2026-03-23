# Design System — Mitra ERP

> Blue-primary ERP: `--primary` = `oklch(0.546 0.245 262.881)`, Geist font, `rounded-xl` cards with `ring-1 ring-foreground/10`, high-density layouts.

## 1. Color Tokens

### Status Colors (not in `globals.css` — use these Tailwind classes directly)

| Status | Background | Text | Border | Usage |
|--------|-----------|------|--------|-------|
| Active/Success | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | "activo" badges |
| Warning | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Deadlines, caution |
| Error/Inactive | `bg-destructive/10` | `text-destructive` | — | "inactivo", errors |
| Info | `bg-blue-50` | `text-blue-700` | `border-blue-200` | Informational |

### Alert Dots

`<span className="h-2 w-2 rounded-full bg-red-500" />` — swap `bg-red-500` for `bg-amber-500`, `bg-emerald-500`, `bg-blue-500`.

## 2. Typography

| Role | Classes | Usage |
|------|---------|-------|
| Page title | `text-2xl font-bold` | "Dashboard", "Recursos Humanos" |
| Page subtitle | `text-sm text-muted-foreground` | Below titles |
| Section title | `text-lg font-semibold` | "Alertas Recientes" |
| Stat number | `text-3xl font-bold` | Card KPIs |
| Stat label | `text-sm font-medium text-muted-foreground` | Card titles |
| Stat subtitle | `text-xs text-muted-foreground` | "+2 este mes" |
| Body / table cell | `text-sm` | General text |
| Table header | `text-sm font-medium` | Column headers |
| Badge | `text-xs font-medium` | Status pills |

## 3. Spacing

| Context | Classes |
|---------|---------|
| Page wrapper | `space-y-6 p-6` |
| Stat card grid | `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` |
| Catalog card grid | `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3` |
| Two-column sections | `grid grid-cols-1 gap-6 lg:grid-cols-2` |
| Form field gap | `space-y-4` |
| Form card max width | `max-w-2xl` |

## 4. Component Patterns

### Status Badge

```tsx
<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">activo</Badge>
<Badge variant="destructive">inactivo</Badge>
<Badge className="bg-amber-50 text-amber-700 border-amber-200 border">pendiente</Badge>
```

### Stat Card

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    <CardAction><Icon className="h-5 w-5 text-muted-foreground" /></CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
  </CardContent>
</Card>
```

### Catalog Card

```tsx
<Link href={href}>
  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{count} registros</span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
</Link>
```

### Alert Item

```tsx
<div className="flex items-start gap-3 py-3">
  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
  <div>
    <p className="text-sm">{message}</p>
    <p className="text-xs text-muted-foreground">{timeAgo}</p>
  </div>
</div>
```

### Quick Action Item

```tsx
<Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors">
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
    <Icon className="h-4 w-4 text-primary" />
  </div>
  <span className="text-sm font-medium">{label}</span>
</Link>
```

### Top Bar

```tsx
<header className="flex h-14 items-center gap-4 border-b px-6">
  <SidebarTrigger className="-ml-2" />
  <Separator orientation="vertical" className="h-4" />
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input placeholder="Buscar..." className="pl-9 h-9" />
  </div>
  <div className="ml-auto flex items-center gap-3">
    <span className="text-sm text-muted-foreground">{roleName}</span>
    <Separator orientation="vertical" className="h-4" />
    <Button variant="ghost" size="icon-sm"><Bell className="h-4 w-4" /></Button>
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
    </Avatar>
    <Button variant="ghost" size="icon-sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
  </div>
</header>
```

## 5. Layout Patterns

### Page Header (all pages)

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
  {/* Optional: create button on the right */}
</div>
```

### List Page

Page header → stat cards (optional) → tabs with `variant="line"` (optional) → search/filter bar → `DataTable`.

### Detail Page

Breadcrumb → page header with edit button → content in `Card` sections.

### Form Page

Page header → `Card className="max-w-2xl"` → `Form` with `space-y-4` fields → submit + cancel buttons.

### Dashboard Page

Page header → stat cards (4-col grid) → two-column grid: alerts card + quick actions card.

### Catalog Page

Page header → 3-col grid of catalog cards.

### Login Page (Split Layout)

`flex min-h-screen`: left half `bg-primary text-primary-foreground` with branding/features, right half with centered form.

## 6. Golden Rules

1. **Primary is blue.** `bg-primary` = blue. If buttons look gray, the token is wrong.
2. **No hardcoded colors.** Use semantic tokens (`text-foreground`, `bg-muted`, `bg-primary`). Never `bg-[#hex]`.
3. **Cards use ring, not shadow.** `ring-1 ring-foreground/10` (built into Card). Only popovers get `shadow-md`.
4. **Status badges use semantic colors.** Green for active, amber for warning, destructive for errors. Never `variant="default"` for statuses.
5. **Icons: `h-4 w-4`** default, `h-5 w-5` stat cards, `h-6 w-6` catalog circles.
6. **Page content: `p-6`.** Always `<div className="space-y-6 p-6">` inside `SidebarInset`.
7. **Forms: `max-w-2xl`.** Never full-width.
8. **Base UI, not Radix.** `render={<Link />}`, not `asChild`. `nativeButton={false}` for non-button elements.
9. **Tabs: `variant="line"`** with Lucide icons for multi-section modules.
10. **Labels from `lib/labels.ts`.** No hardcoded user-facing text.
