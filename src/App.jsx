import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  Banknote,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FolderOpen,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Pencil,
  Plus,
  Repeat,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import {
  addDays,
  addMonths,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import './index.css'

const money = new Intl.NumberFormat('en-GY', {
  style: 'currency',
  currency: 'GYD',
  maximumFractionDigits: 0,
})

const today = new Date(2026, 4, 14)

const brand = {
  navy: '#1F4E79',
  blue: '#2E75B6',
  green: '#1E6B3C',
  orange: '#C55A11',
  gold: '#C9A227',
  red: '#C00000',
  purple: '#5B2C6F',
}

const navItems = [
  ['overview', 'Overview', LayoutDashboard],
  ['calendar', 'Calendar', CalendarDays],
  ['clients', 'Clients/Sites', Building2],
  ['finance', 'Finance', Banknote],
  ['workorders', 'Work Orders', ClipboardCheck],
  ['tasks', 'Tasks', CheckCircle2],
  ['staff', 'Staff', Users],
  ['inventory', 'Inventory', Package],
  ['documents', 'Documents', FolderOpen],
  ['messages', 'Messages', MessageSquareText],
  ['settings', 'Settings', Settings],
]

const initialStaff = [
  {
    id: 's1',
    name: 'Marcus Thomas',
    initials: 'MT',
    role: 'Senior Cleaner',
    phone: '592-621-3456',
    nis: 'NIS-10234',
    hireDate: '2025-01-15',
    wage: 75000,
    status: 'active',
  },
  {
    id: 's2',
    name: 'Keisha Rodrigues',
    initials: 'KR',
    role: 'Cleaner',
    phone: '592-614-7891',
    nis: 'NIS-10235',
    hireDate: '2025-01-15',
    wage: 60000,
    status: 'active',
  },
  {
    id: 's3',
    name: 'Devon James',
    initials: 'DJ',
    role: 'Cleaner',
    phone: '592-633-9012',
    nis: 'NIS-10289',
    hireDate: '2026-03-01',
    wage: 60000,
    status: 'active',
  },
]

const initialClients = [
  {
    id: 'c1',
    name: 'Hopkinson Mining Logistics',
    siteName: 'Hopkinson Airport Site',
    address: 'Hopkinson Airport operations compound',
    contactName: 'A. Persaud',
    contactPhone: '592-600-1100',
    contactEmail: 'operations@hopkinson.example',
    serviceSchedule: 'Monday / Wednesday / Friday',
    billingTerms: 'Net 14',
    monthlyRate: 186000,
    status: 'active',
    notes: 'Primary cleaning services contract FIG-CSA-2026-001.',
  },
]

const initialInvoices = [
  {
    id: 'i1',
    invoiceNo: 'INV-2026-001',
    client: 'Hopkinson Mining Logistics',
    period: 'February 2026',
    date: '2026-02-01',
    dueDate: '2026-02-15',
    amount: 186000,
    status: 'paid',
    paidDate: '2026-02-12',
    woRefs: 'WO-2026-001 to WO-2026-012',
    notes: 'Routine monthly cleaning service',
  },
  {
    id: 'i2',
    invoiceNo: 'INV-2026-031',
    client: 'Hopkinson Mining Logistics',
    period: 'April 2026',
    date: '2026-04-01',
    dueDate: '2026-04-15',
    amount: 175900,
    status: 'sent',
    paidDate: '',
    woRefs: 'WO-2026-001',
    notes: 'Invoice variant preserved from source documents',
  },
  {
    id: 'i3',
    invoiceNo: 'INV-2026-031b',
    client: 'Hopkinson Mining Logistics',
    period: 'February 2026 Supplemental',
    date: '2026-04-01',
    dueDate: '2026-04-15',
    amount: 22800,
    status: 'sent',
    paidDate: '',
    woRefs: 'Supplemental February visits',
    notes: 'Two February visits not billed on main invoice',
  },
]

const initialExpenses = [
  {
    id: 'e1',
    date: '2026-05-03',
    vendor: 'Staff Payroll',
    category: 'payroll',
    description: 'May first-half cleaning crew payroll',
    amount: 67500,
    paymentMethod: 'Bank transfer',
    status: 'paid',
    workOrderRef: 'WO-2026-041 / WO-2026-042',
    receiptRef: 'Payroll register',
    notes: 'Marcus and Keisha scheduled visits',
  },
  {
    id: 'e2',
    date: '2026-05-07',
    vendor: 'Metro Office & Janitorial',
    category: 'supplies',
    description: 'Restroom consumables and disinfectant',
    amount: 28600,
    paymentMethod: 'Cash',
    status: 'paid',
    workOrderRef: 'WO-2026-043',
    receiptRef: 'Receipt pending upload',
    notes: 'Triggered by low supplies note',
  },
  {
    id: 'e3',
    date: '2026-05-10',
    vendor: 'Taxi / site transportation',
    category: 'transportation',
    description: 'Crew transportation to Hopkinson site',
    amount: 12000,
    paymentMethod: 'Cash',
    status: 'submitted',
    workOrderRef: 'WO-2026-044',
    receiptRef: '',
    notes: 'Round trip site transport',
  },
]

const initialRecurringExpenses = [
  {
    id: 'r1',
    name: 'Crew payroll allocation',
    category: 'payroll',
    amount: 135000,
    frequency: 'monthly',
    nextDue: '2026-05-31',
    vendor: 'Staff Payroll',
    status: 'active',
  },
  {
    id: 'r2',
    name: 'Transportation allowance',
    category: 'transportation',
    amount: 24000,
    frequency: 'monthly',
    nextDue: '2026-05-31',
    vendor: 'Taxi / site transportation',
    status: 'active',
  },
]

const initialInventory = [
  { id: 'inv1', item: 'Toilet paper rolls', category: 'Restroom', unit: 'rolls', quantity: 36, reorderLevel: 24, supplier: 'Metro Office & Janitorial', lastPurchased: '2026-05-07', unitCost: 320, notes: 'Used on all site visits.' },
  { id: 'inv2', item: 'Liquid hand soap', category: 'Restroom', unit: 'litres', quantity: 8, reorderLevel: 6, supplier: 'Metro Office & Janitorial', lastPurchased: '2026-05-07', unitCost: 1450, notes: 'Keep spare stock before month-end.' },
  { id: 'inv3', item: 'Trash bags', category: 'Waste', unit: 'packs', quantity: 5, reorderLevel: 4, supplier: 'Cleaning Supply Depot', lastPurchased: '2026-04-29', unitCost: 1800, notes: 'Heavy duty preferred.' },
  { id: 'inv4', item: 'Disinfectant concentrate', category: 'Chemicals', unit: 'bottles', quantity: 3, reorderLevel: 4, supplier: 'Metro Office & Janitorial', lastPurchased: '2026-05-07', unitCost: 2400, notes: 'Below reorder level.' },
]

const initialStaffHours = [
  { id: 'h1', date: '2026-05-04', staffName: 'Marcus Thomas', workOrderRef: 'WO-2026-041', hours: 3, rate: 900, status: 'approved', notes: 'Morning service visit.' },
  { id: 'h2', date: '2026-05-04', staffName: 'Keisha Rodrigues', workOrderRef: 'WO-2026-041', hours: 3, rate: 800, status: 'approved', notes: 'Morning service visit.' },
  { id: 'h3', date: '2026-05-08', staffName: 'Devon James', workOrderRef: 'WO-2026-043', hours: 3, rate: 800, status: 'submitted', notes: 'Pending sign-off.' },
]

const cleaningTasks = [
  'Floor sweeping - all areas',
  'Floor mopping / wet cleaning',
  'Dusting surfaces, furniture, fixtures',
  'Restroom toilets, urinals, sinks',
  'Restroom mirrors and counters',
  'Restock restroom consumables',
  'High-touch door handles and light switches',
  'High-touch countertops and handrails',
  'Waste collection',
  'Waste disposal',
  'Common areas and reception',
  'Interior windows/glass, if in scope',
]

const initialWorkOrders = [
  {
    id: 'wo1',
    woNumber: 'WO-2026-041',
    date: '2026-05-04',
    day: 'Monday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Keisha Rodrigues',
    status: 'signed',
    clientRep: 'A. Persaud',
    signedDate: '2026-05-04',
    notes: 'Completed to standard',
  },
  {
    id: 'wo2',
    woNumber: 'WO-2026-042',
    date: '2026-05-06',
    day: 'Wednesday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Keisha Rodrigues',
    status: 'signed',
    clientRep: 'A. Persaud',
    signedDate: '2026-05-06',
    notes: 'Restroom consumables low',
  },
  {
    id: 'wo3',
    woNumber: 'WO-2026-043',
    date: '2026-05-08',
    day: 'Friday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Devon James',
    status: 'completed',
    clientRep: '',
    signedDate: '',
    notes: 'Pending client sign-off',
  },
  {
    id: 'wo4',
    woNumber: 'WO-2026-044',
    date: '2026-05-11',
    day: 'Monday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Keisha Rodrigues',
    status: 'pending-signature',
    clientRep: '',
    signedDate: '',
    notes: 'Supervisor review needed',
  },
  {
    id: 'wo5',
    woNumber: 'WO-2026-045',
    date: '2026-05-13',
    day: 'Wednesday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Devon James',
    status: 'scheduled',
    clientRep: '',
    signedDate: '',
    notes: 'Airport access pass check',
  },
  {
    id: 'wo6',
    woNumber: 'WO-2026-046',
    date: '2026-05-15',
    day: 'Friday',
    arrival: '08:00',
    departure: '11:00',
    staff1: 'Marcus Thomas',
    staff2: 'Keisha Rodrigues',
    status: 'scheduled',
    clientRep: '',
    signedDate: '',
    notes: 'Upcoming service visit',
  },
]

const initialTasks = [
  {
    id: 't1',
    title: 'Obtain airport security pass for Devon James',
    description: 'Confirm access requirements with Hopkinson site contact.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-05-17',
    assignedTo: 'Patrick King',
  },
  {
    id: 't2',
    title: 'Send April invoice follow-up',
    description: 'Follow up on INV-2026-031 and supplemental invoice.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-05-14',
    assignedTo: 'Patrick King',
  },
  {
    id: 't3',
    title: 'Order restroom consumables',
    description: 'Restock supplies before next month-end invoice package.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-05-21',
    assignedTo: 'Marcus Thomas',
  },
  {
    id: 't4',
    title: 'Review and sign May work orders',
    description: 'Make sure WO-2026-043 and WO-2026-044 are signed.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-05-16',
    assignedTo: 'Patrick King',
  },
  {
    id: 't5',
    title: 'Submit NIS contributions',
    description: 'Record staff contribution summary for April.',
    priority: 'high',
    status: 'done',
    dueDate: '2026-05-10',
    assignedTo: 'Patrick King',
  },
  {
    id: 't6',
    title: 'Renew business registration',
    description: 'Registration certificate no. 278040 renews by January 19, 2027.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2027-01-19',
    assignedTo: 'Patrick King',
  },
]

const initialDocuments = [
  ['FIG_Dashboard_PRD.md', 'Product', 'Markdown', 'PRD for this fresh dashboard build'],
  ['FIG Business Registration .pdf', 'Compliance', 'PDF', 'Certificate no. 278040'],
  ['Scanned Document.pdf', 'Compliance', 'PDF', 'Duplicate registration scan'],
  ['FreshIslandGlobal Invoice Template.pdf', 'Finance', 'PDF', 'Monthly invoice template'],
  ['FIG_Invoice_Template.pdf', 'Finance', 'PDF', 'April invoice template'],
  ['Supplemental FIG_Invoice INV_2026_031b.docx', 'Finance', 'DOCX', 'Supplemental invoice'],
  ['FreshIslandGlobal WorkOrder Template.docx', 'Operations', 'DOCX', 'Visit work order template'],
  ['FreshIslandGlobal_WorkOrder_Template.pdf', 'Operations', 'PDF', 'Printable work order'],
  ['01_Monthly_Completion_Summary.pdf', 'Operations', 'PDF', 'Invoice support summary'],
  ['03_Staff_Assignment_Sheet.pdf', 'HR', 'PDF', 'Weekly roster and hours'],
  ['business_plan.docx', 'Strategy', 'DOCX', 'ExpatLink Pro business plan'],
  ['setup_fig_system.py', 'System', 'Python', 'Folder and tracker setup script'],
].map((doc, index) => ({
  id: `d${index + 1}`,
  filename: doc[0],
  category: doc[1],
  type: doc[2],
  notes: doc[3],
  size: index < 2 ? '700 KB' : `${Math.max(11, 104 - index * 6)} KB`,
  modified: index === 0 ? '2026-05-14' : '2026-04-24',
}))

const initialMessages = [
  {
    id: 'm1',
    source: 'Slack demo',
    sender: 'Marcus Thomas',
    text: '/note Restroom supplies running low after Wednesday visit',
    timestamp: '2026-05-13 11:20',
    processed: true,
  },
  {
    id: 'm2',
    source: 'Slack demo',
    sender: 'Patrick King',
    text: '/status',
    timestamp: '2026-05-14 08:05',
    processed: true,
  },
]

function App() {
  const [active, setActive] = useState('overview')
  const [month, setMonth] = useState(today)
  const [clients, setClients] = useState(initialClients)
  const [invoices, setInvoices] = useState(initialInvoices)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [recurringExpenses, setRecurringExpenses] = useState(initialRecurringExpenses)
  const [workOrders, setWorkOrders] = useState(initialWorkOrders)
  const [tasks, setTasks] = useState(initialTasks)
  const [staff, setStaff] = useState(initialStaff)
  const [staffHours, setStaffHours] = useState(initialStaffHours)
  const [inventory, setInventory] = useState(initialInventory)
  const [documents, setDocuments] = useState(initialDocuments)
  const [messages, setMessages] = useState(initialMessages)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [config, setConfig] = useState({
    googleClientId: '',
    sheetId: '',
    slackWebhookUrl: '',
    slackChannelId: '',
    googleConnected: false,
    slackConnected: false,
  })

  const metrics = useMemo(() => getMetrics(invoices, expenses, workOrders, tasks, messages), [invoices, expenses, workOrders, tasks, messages])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const sendSlackMessage = async (text) => {
    try {
      const response = await fetch('/.netlify/functions/send-slack', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text,
          webhookUrl: config.slackWebhookUrl,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.error || 'Slack message failed.')
      }
      setConfig((current) => ({ ...current, slackConnected: true }))
      showToast('Slack message sent.')
      return true
    } catch (error) {
      showToast(error.message || 'Slack message failed.')
      return false
    }
  }

  const viewProps = {
    metrics,
    clients,
    setClients,
    invoices,
    setInvoices,
    expenses,
    setExpenses,
    recurringExpenses,
    setRecurringExpenses,
    workOrders,
    setWorkOrders,
    tasks,
    setTasks,
    staff,
    setStaff,
    staffHours,
    setStaffHours,
    inventory,
    setInventory,
    documents,
    setDocuments,
    messages,
    setMessages,
    query,
    setQuery,
    month,
    setMonth,
    config,
    setConfig,
    sendSlackMessage,
    showToast,
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} metrics={metrics} config={config} />
      <main className="main-panel">
        <TopBar active={active} metrics={metrics} setQuery={setQuery} query={query} config={config} />
        <section className="view-frame">
          {active === 'overview' && <Overview {...viewProps} setActive={setActive} />}
          {active === 'calendar' && <CalendarView {...viewProps} />}
          {active === 'clients' && <ClientsView {...viewProps} />}
          {active === 'finance' && <FinanceView {...viewProps} />}
          {active === 'workorders' && <WorkOrdersView {...viewProps} />}
          {active === 'tasks' && <TasksView {...viewProps} />}
          {active === 'staff' && <StaffView {...viewProps} />}
          {active === 'inventory' && <InventoryView {...viewProps} />}
          {active === 'documents' && <DocumentsView {...viewProps} />}
          {active === 'messages' && <MessagesView {...viewProps} />}
          {active === 'settings' && <SettingsView {...viewProps} />}
        </section>
      </main>
      {toast && <div className="toast"><Sparkles size={18} />{toast}</div>}
    </div>
  )
}

function Sidebar({ active, setActive, metrics, config }) {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div className="brand-mark">FIG</div>
        <div>
          <h1>Fresh Island Global</h1>
          <p>Operations Dashboard</p>
        </div>
      </div>
      <nav className="nav-list" aria-label="Dashboard navigation">
        {navItems.map(([id, label, Icon]) => (
          <button className={`nav-item ${active === id ? 'active' : ''}`} key={id} onClick={() => setActive(id)}>
            <Icon size={19} />
            <span>{label}</span>
            {id === 'messages' && metrics.unreadMessages > 0 && <b>{metrics.unreadMessages}</b>}
          </button>
        ))}
      </nav>
      <div className="sidebar-card">
        <p className="eyebrow">Contract</p>
        <strong>FIG-CSA-2026-001</strong>
        <span>Hopkinson Mining Logistics</span>
      </div>
      <div className="connection-row">
        <span className={`dot ${config.googleConnected ? 'good' : ''}`}></span>
        {config.googleConnected ? 'Live Data' : 'Demo Mode'}
      </div>
    </aside>
  )
}

function TopBar({ active, metrics, query, setQuery, config }) {
  const current = navItems.find(([id]) => id === active)
  const label = current?.[1] ?? 'Dashboard'
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{format(today, 'EEEE, MMMM d, yyyy')}</p>
        <h2>{label}</h2>
      </div>
      <label className="global-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." />
      </label>
      <div className="topbar-status">
        <span><Bell size={16} /> {metrics.overdueTasks} overdue</span>
        <span className={config.slackConnected ? 'live-pill' : ''}><MessageSquareText size={16} /> Slack</span>
      </div>
    </header>
  )
}

function Overview({ metrics, invoices, workOrders, tasks, messages, setActive, sendSlackMessage }) {
  const kpis = [
    ['Monthly Billed', money.format(metrics.monthlyBilled), Banknote, 'navy'],
    ['Collected', money.format(metrics.collected), CheckCircle2, 'green'],
    ['Outstanding', money.format(metrics.outstanding), Clock3, 'orange'],
    ['Visits This Month', metrics.monthVisits, CalendarDays, 'blue'],
    ['Pending Sign-Offs', metrics.pendingSignoffs, ClipboardCheck, 'gold'],
    ['Overdue Tasks', metrics.overdueTasks, AlertTriangle, 'red'],
  ]
  return (
    <div className="stack">
      <div className="hero-band">
        <div>
          <p className="eyebrow">Professional cleaning services</p>
          <h2>Hopkinson Airport contract at a glance</h2>
          <p>Schedule, work orders, invoices, staff, documents, messages, and compliance reminders in one workspace.</p>
        </div>
        <div className="hero-metric">
          <span>Registration renewal</span>
          <strong>Jan 19, 2027</strong>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => sendSlackMessage(`FIG alert: ${metrics.pendingSignoffs} work order(s) need client sign-off for Hopkinson Mining Logistics.`)}>
          <ClipboardCheck size={16} /> Send sign-off alert
        </button>
        <button onClick={() => sendSlackMessage(`FIG finance alert: ${metrics.outstanding ? money.format(metrics.outstanding) : 'No'} outstanding balance currently tracked.`)}>
          <Banknote size={16} /> Send finance alert
        </button>
        <button onClick={() => sendSlackMessage(`FIG task alert: ${metrics.overdueTasks} overdue task(s) need attention today.`)}>
          <AlertTriangle size={16} /> Send task alert
        </button>
      </div>
      <div className="kpi-grid">
        {kpis.map(([label, value, Icon, tone], index) => (
          <article className={`kpi ${tone}`} key={label} style={{ animationDelay: `${index * 45}ms` }}>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
            <Icon size={24} />
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <Card title="Revenue Overview" action={<button onClick={() => setActive('finance')}>Finance</button>}>
          <ChartFrame>
            <BarChart data={revenueData(invoices)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value) => money.format(value)} />
              <Bar dataKey="billed" fill={brand.navy} radius={[6, 6, 0, 0]} />
              <Bar dataKey="collected" fill={brand.green} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartFrame>
        </Card>
        <Card title="Recent Activity" action={<button onClick={() => setActive('messages')}>Messages</button>}>
          <ActivityList workOrders={workOrders} invoices={invoices} messages={messages} />
        </Card>
      </div>
      <div className="triple-grid">
        <MiniTable
          title="Pending Sign-Offs"
          rows={workOrders.filter((wo) => wo.status !== 'signed').slice(0, 4).map((wo) => [wo.woNumber, wo.date, statusBadge(wo.status)])}
        />
        <MiniTable
          title="Priority Tasks"
          rows={tasks.filter((task) => task.status !== 'done').slice(0, 4).map((task) => [task.title, task.dueDate, priorityBadge(task.priority)])}
        />
        <MiniTable
          title="Invoice Status"
          rows={invoices.map((invoice) => [invoice.invoiceNo, money.format(invoice.amount), statusBadge(invoice.status)])}
        />
      </div>
    </div>
  )
}

function CalendarView({ month, setMonth, workOrders, tasks, invoices, showToast }) {
  const selectedEvents = getEventsForMonth(month, workOrders, tasks, invoices)
  const [selectedDate, setSelectedDate] = useState(today)
  const cells = calendarCells(month)
  const dayEvents = selectedEvents.filter((event) => isSameDay(parseISO(event.date), selectedDate))

  return (
    <div className="calendar-layout">
      <Card
        title={format(month, 'MMMM yyyy')}
        action={
          <div className="segmented">
            <button onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft size={16} /></button>
            <button onClick={() => setMonth(today)}>Today</button>
            <button onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={16} /></button>
          </div>
        }
      >
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <b key={day}>{day}</b>)}
          {cells.map((date) => {
            const events = selectedEvents.filter((event) => isSameDay(parseISO(event.date), date))
            return (
              <button
                className={`cal-cell ${isSameMonth(date, month) ? '' : 'muted'} ${isSameDay(date, selectedDate) ? 'selected' : ''}`}
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
              >
                <span>{format(date, 'd')}</span>
                <div>
                  {events.slice(0, 3).map((event) => <i className={`event-dot ${event.type}`} key={event.id}></i>)}
                </div>
              </button>
            )
          })}
        </div>
      </Card>
      <aside className="side-stack">
        <Card title={format(selectedDate, 'MMMM d')}>
          {dayEvents.length ? dayEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <span className={`event-type ${event.type}`}>{event.type}</span>
              <strong>{event.title}</strong>
              <p>{event.detail}</p>
            </div>
          )) : <EmptyState text="No events scheduled for this date." />}
          <button className="primary full" onClick={() => showToast('Visit planning form is ready for Google Sheets hookup.')}>
            <Plus size={16} /> Add Visit
          </button>
        </Card>
        <Card title="Upcoming 7 Days">
          {selectedEvents
            .filter((event) => parseISO(event.date) >= today && parseISO(event.date) <= addDays(today, 7))
            .slice(0, 6)
            .map((event) => (
              <div className="compact-row" key={event.id}>
                <span>{format(parseISO(event.date), 'MMM d')}</span>
                <strong>{event.title}</strong>
              </div>
            ))}
        </Card>
      </aside>
    </div>
  )
}

function ClientsView({ clients, setClients, workOrders, invoices, query, showToast }) {
  const [editingClient, setEditingClient] = useState(null)
  const filtered = clients.filter((client) => JSON.stringify(client).toLowerCase().includes(query.toLowerCase()))
  const newClient = () => {
    setEditingClient({
      id: `c${Date.now()}`,
      name: 'New Client',
      siteName: 'New Site',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      serviceSchedule: '',
      billingTerms: 'Net 14',
      monthlyRate: 0,
      status: 'active',
      notes: '',
      isNew: true,
    })
  }
  const saveClient = (client) => {
    const normalized = { ...client, monthlyRate: Number(client.monthlyRate) || 0 }
    delete normalized.isNew
    if (client.isNew) {
      setClients([normalized, ...clients])
      showToast('Client/site created.')
    } else {
      setClients(clients.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Client/site updated.')
    }
    setEditingClient(null)
  }
  const deleteClient = (id) => {
    const client = clients.find((item) => item.id === id)
    if (!window.confirm(`Delete ${client?.name || 'this client/site'}?`)) return
    setClients(clients.filter((item) => item.id !== id))
    showToast('Client/site deleted.')
  }

  return (
    <div className="stack">
      <div className="stat-grid three">
        <Stat label="Clients / Sites" value={clients.length} />
        <Stat label="Active Sites" value={clients.filter((client) => client.status === 'active').length} tone="green" />
        <Stat label="Monthly Contract Value" value={money.format(clients.reduce((sum, client) => sum + client.monthlyRate, 0))} tone="blue" />
      </div>
      <Card title="Clients & Sites" action={<button className="primary" onClick={newClient}><Plus size={16} /> New Client/Site</button>}>
        <DataTable
          headers={['Client', 'Site', 'Contact', 'Schedule', 'Terms', 'Monthly Rate', 'Status', 'Actions']}
          rows={filtered.map((client) => [
            client.name,
            client.siteName,
            <div className="small-stack"><span>{client.contactName}</span><small>{client.contactPhone}</small></div>,
            client.serviceSchedule,
            client.billingTerms,
            money.format(client.monthlyRate),
            statusBadge(client.status),
            <div className="row-actions">
              <button onClick={() => setEditingClient({ ...client })}><Pencil size={15} /> Edit</button>
              <button className="danger-action" onClick={() => deleteClient(client.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      <div className="dashboard-grid">
        <MiniTable
          title="Work Orders By Client"
          rows={clients.map((client) => [client.name, client.siteName, workOrders.filter((wo) => wo.notes.includes(client.siteName) || client.name === 'Hopkinson Mining Logistics').length])}
        />
        <MiniTable
          title="Invoice Value By Client"
          rows={clients.map((client) => [client.name, client.billingTerms, money.format(invoices.filter((invoice) => invoice.client === client.name).reduce((sum, invoice) => sum + invoice.amount, 0))])}
        />
      </div>
      {editingClient && (
        <ClientModal
          client={editingClient}
          setClient={setEditingClient}
          onClose={() => setEditingClient(null)}
          onSave={saveClient}
        />
      )}
    </div>
  )
}

function ClientModal({ client, setClient, onClose, onSave }) {
  const update = (field, value) => setClient({ ...client, [field]: value })
  const canSave = client.name && client.siteName && client.contactName

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(client)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{client.isNew ? 'Create' : 'Edit'}</p>
            <h3>{client.name || 'Client / Site'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close client form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Client Name" value={client.name} onChange={(value) => update('name', value)} />
          <Field label="Site Name" value={client.siteName} onChange={(value) => update('siteName', value)} />
          <Field label="Address" value={client.address} onChange={(value) => update('address', value)} />
          <Field label="Contact Name" value={client.contactName} onChange={(value) => update('contactName', value)} />
          <Field label="Contact Phone" value={client.contactPhone} onChange={(value) => update('contactPhone', value)} />
          <Field label="Contact Email" value={client.contactEmail} onChange={(value) => update('contactEmail', value)} />
          <Field label="Service Schedule" value={client.serviceSchedule} onChange={(value) => update('serviceSchedule', value)} />
          <Field label="Billing Terms" value={client.billingTerms} onChange={(value) => update('billingTerms', value)} />
          <Field label="Monthly Rate (GYD)" type="number" value={String(client.monthlyRate)} onChange={(value) => update('monthlyRate', value)} />
          <label className="field">
            <span>Status</span>
            <select value={client.status} onChange={(event) => update('status', event.target.value)}>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="field span-2">
            <span>Notes</span>
            <textarea value={client.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{client.isNew ? 'Create Client/Site' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function FinanceView({ invoices, setInvoices, expenses, setExpenses, recurringExpenses, setRecurringExpenses, query, showToast }) {
  const [filter, setFilter] = useState('all')
  const [expenseFilter, setExpenseFilter] = useState('all')
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)
  const [editingRecurring, setEditingRecurring] = useState(null)
  const filtered = invoices.filter((invoice) => {
    const displayStatus = isOverdue(invoice) ? 'overdue' : invoice.status
    const matchesStatus = filter === 'all' || displayStatus === filter
    const matchesQuery = JSON.stringify(invoice).toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  })
  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = expenseFilter === 'all' || expense.category === expenseFilter
    const matchesQuery = JSON.stringify(expense).toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })
  const totals = getFinanceTotals(invoices, expenses)
  const expenseTotals = getExpenseTotals(expenses)
  const newExpense = () => {
    setEditingExpense({
      id: `e${Date.now()}`,
      date: format(today, 'yyyy-MM-dd'),
      vendor: '',
      category: 'supplies',
      description: '',
      amount: 0,
      paymentMethod: 'Cash',
      status: 'submitted',
      workOrderRef: '',
      receiptRef: '',
      notes: '',
      isNew: true,
    })
  }
  const newRecurringExpense = () => {
    setEditingRecurring({
      id: `r${Date.now()}`,
      name: 'New recurring expense',
      category: 'other',
      amount: 0,
      frequency: 'monthly',
      nextDue: format(today, 'yyyy-MM-dd'),
      vendor: '',
      status: 'active',
      isNew: true,
    })
  }
  const newInvoice = () => {
    setEditingInvoice({
      id: `i${Date.now()}`,
      invoiceNo: `INV-2026-${String(invoices.length + 32).padStart(3, '0')}`,
      client: 'Hopkinson Mining Logistics',
      period: 'May 2026',
      date: '2026-05-31',
      dueDate: '2026-06-14',
      amount: 186000,
      status: 'draft',
      paidDate: '',
      woRefs: 'May work orders',
      notes: '',
      isNew: true,
    })
  }
  const markPaid = (id) => {
    setInvoices(invoices.map((invoice) => invoice.id === id ? { ...invoice, status: 'paid', paidDate: format(today, 'yyyy-MM-dd') } : invoice))
    showToast('Invoice marked paid.')
  }
  const saveInvoice = (invoice) => {
    const normalized = {
      ...invoice,
      amount: Number(invoice.amount) || 0,
      paidDate: invoice.status === 'paid' ? invoice.paidDate || format(today, 'yyyy-MM-dd') : invoice.paidDate,
    }
    delete normalized.isNew

    if (invoice.isNew) {
      setInvoices([normalized, ...invoices])
      showToast('Invoice created.')
    } else {
      setInvoices(invoices.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Invoice updated.')
    }
    setEditingInvoice(null)
  }
  const deleteInvoice = (id) => {
    const invoice = invoices.find((item) => item.id === id)
    if (!window.confirm(`Delete ${invoice?.invoiceNo || 'this invoice'}?`)) return
    setInvoices(invoices.filter((item) => item.id !== id))
    showToast('Invoice deleted.')
  }
  const saveExpense = (expense) => {
    const normalized = {
      ...expense,
      amount: Number(expense.amount) || 0,
    }
    delete normalized.isNew

    if (expense.isNew) {
      setExpenses([normalized, ...expenses])
      showToast('Expense created.')
    } else {
      setExpenses(expenses.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Expense updated.')
    }
    setEditingExpense(null)
  }
  const deleteExpense = (id) => {
    const expense = expenses.find((item) => item.id === id)
    if (!window.confirm(`Delete ${expense?.description || 'this expense'}?`)) return
    setExpenses(expenses.filter((item) => item.id !== id))
    showToast('Expense deleted.')
  }
  const saveRecurringExpense = (expense) => {
    const normalized = { ...expense, amount: Number(expense.amount) || 0 }
    delete normalized.isNew
    if (expense.isNew) {
      setRecurringExpenses([normalized, ...recurringExpenses])
      showToast('Recurring expense created.')
    } else {
      setRecurringExpenses(recurringExpenses.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Recurring expense updated.')
    }
    setEditingRecurring(null)
  }
  const deleteRecurringExpense = (id) => {
    const expense = recurringExpenses.find((item) => item.id === id)
    if (!window.confirm(`Delete ${expense?.name || 'this recurring expense'}?`)) return
    setRecurringExpenses(recurringExpenses.filter((item) => item.id !== id))
    showToast('Recurring expense deleted.')
  }

  return (
    <div className="stack">
      <div className="stat-grid four">
        <Stat label="Total Billed" value={money.format(totals.billed)} />
        <Stat label="Collected" value={money.format(totals.collected)} tone="green" />
        <Stat label="Outstanding" value={money.format(totals.outstanding)} tone="orange" />
        <Stat label="Net Position" value={money.format(totals.net)} tone={totals.net >= 0 ? 'blue' : 'red'} />
      </div>
      <div className="stat-grid four">
        <Stat label="Total Expenses" value={money.format(expenseTotals.total)} tone="red" />
        <Stat label="Payroll" value={money.format(expenseTotals.payroll)} tone="orange" />
        <Stat label="Supplies" value={money.format(expenseTotals.supplies)} tone="gold" />
        <Stat label="Transportation" value={money.format(expenseTotals.transportation)} tone="blue" />
      </div>
      <div className="dashboard-grid">
        <Card title="Revenue Trend">
          <ChartFrame>
            <AreaChart data={revenueData(invoices)}>
              <defs>
                <linearGradient id="billed" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={brand.navy} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={brand.navy} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value) => money.format(value)} />
              <Area type="monotone" dataKey="billed" stroke={brand.navy} fill="url(#billed)" strokeWidth={3} />
              <Area type="monotone" dataKey="collected" stroke={brand.green} fill={brand.green} fillOpacity={0.08} strokeWidth={3} />
            </AreaChart>
          </ChartFrame>
        </Card>
        <Card title="Payment Breakdown">
          <ChartFrame>
            <PieChart>
              <Pie data={paymentBreakdown(invoices)} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88}>
                {paymentBreakdown(invoices).map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => money.format(value)} />
            </PieChart>
          </ChartFrame>
        </Card>
      </div>
      <Card title="Expense Breakdown">
        <div className="expense-breakdown">
          {expenseBreakdown(expenses).map((item) => (
            <article key={item.category}>
              <span>{item.label}</span>
              <strong>{money.format(item.value)}</strong>
              <div><i style={{ width: `${item.percent}%`, background: item.color }} /></div>
            </article>
          ))}
        </div>
      </Card>
      <Card title="Invoices" action={<button className="primary" onClick={newInvoice}><Plus size={16} /> New Invoice</button>}>
        <FilterTabs items={['all', 'draft', 'sent', 'paid', 'overdue']} active={filter} setActive={setFilter} />
        <DataTable
          headers={['Invoice', 'Client', 'Period', 'Due', 'Amount', 'Status', 'Actions']}
          rows={filtered.map((invoice) => [
            invoice.invoiceNo,
            invoice.client,
            invoice.period,
            invoice.dueDate,
            money.format(invoice.amount),
            statusBadge(isOverdue(invoice) ? 'overdue' : invoice.status),
            <div className="row-actions">
              <button onClick={() => setEditingInvoice({ ...invoice })}><Pencil size={15} /> Edit</button>
              {invoice.status !== 'paid' && <button onClick={() => markPaid(invoice.id)}>Mark paid</button>}
              <button className="danger-action" onClick={() => deleteInvoice(invoice.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      <Card title="Expenditures" action={<button className="primary" onClick={newExpense}><Plus size={16} /> New Expense</button>}>
        <FilterTabs items={['all', 'payroll', 'supplies', 'transportation', 'equipment', 'utilities', 'fees', 'other']} active={expenseFilter} setActive={setExpenseFilter} />
        <DataTable
          headers={['Date', 'Category', 'Vendor', 'Description', 'Amount', 'Status', 'WO / Receipt', 'Actions']}
          rows={filteredExpenses.map((expense) => [
            expense.date,
            statusBadge(expense.category),
            expense.vendor,
            expense.description,
            money.format(expense.amount),
            statusBadge(expense.status),
            <div className="small-stack"><span>{expense.workOrderRef || 'No WO link'}</span><small>{expense.receiptRef || 'No receipt'}</small></div>,
            <div className="row-actions">
              <button onClick={() => setEditingExpense({ ...expense })}><Pencil size={15} /> Edit</button>
              <button className="danger-action" onClick={() => deleteExpense(expense.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      <Card title="Recurring Expenses" action={<button className="primary" onClick={newRecurringExpense}><Repeat size={16} /> New Recurring</button>}>
        <DataTable
          headers={['Name', 'Category', 'Vendor', 'Frequency', 'Next Due', 'Amount', 'Status', 'Actions']}
          rows={recurringExpenses.map((expense) => [
            expense.name,
            statusBadge(expense.category),
            expense.vendor,
            expense.frequency,
            expense.nextDue,
            money.format(expense.amount),
            statusBadge(expense.status),
            <div className="row-actions">
              <button onClick={() => setEditingRecurring({ ...expense })}><Pencil size={15} /> Edit</button>
              <button className="danger-action" onClick={() => deleteRecurringExpense(expense.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      {editingInvoice && (
        <InvoiceModal
          invoice={editingInvoice}
          setInvoice={setEditingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={saveInvoice}
        />
      )}
      {editingExpense && (
        <ExpenseModal
          expense={editingExpense}
          setExpense={setEditingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={saveExpense}
        />
      )}
      {editingRecurring && (
        <RecurringExpenseModal
          expense={editingRecurring}
          setExpense={setEditingRecurring}
          onClose={() => setEditingRecurring(null)}
          onSave={saveRecurringExpense}
        />
      )}
    </div>
  )
}

function InvoiceModal({ invoice, setInvoice, onClose, onSave }) {
  const update = (field, value) => setInvoice({ ...invoice, [field]: value })
  const canSave = invoice.invoiceNo && invoice.client && invoice.date && invoice.dueDate && Number(invoice.amount) >= 0

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content invoice-modal"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(invoice)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{invoice.isNew ? 'Create' : 'Edit'}</p>
            <h3>{invoice.invoiceNo || 'Invoice'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close invoice form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Invoice No." value={invoice.invoiceNo} onChange={(value) => update('invoiceNo', value)} />
          <Field label="Client" value={invoice.client} onChange={(value) => update('client', value)} />
          <Field label="Service Period" value={invoice.period} onChange={(value) => update('period', value)} />
          <Field label="Amount (GYD)" type="number" value={String(invoice.amount)} onChange={(value) => update('amount', value)} />
          <Field label="Invoice Date" type="date" value={invoice.date} onChange={(value) => update('date', value)} />
          <Field label="Due Date" type="date" value={invoice.dueDate} onChange={(value) => update('dueDate', value)} />
          <label className="field">
            <span>Status</span>
            <select value={invoice.status} onChange={(event) => update('status', event.target.value)}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <Field label="Paid Date" type="date" value={invoice.paidDate} onChange={(value) => update('paidDate', value)} />
          <Field label="Work Order Refs" value={invoice.woRefs} onChange={(value) => update('woRefs', value)} />
          <label className="field span-2">
            <span>Notes</span>
            <textarea value={invoice.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{invoice.isNew ? 'Create Invoice' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function ExpenseModal({ expense, setExpense, onClose, onSave }) {
  const update = (field, value) => setExpense({ ...expense, [field]: value })
  const canSave = expense.date && expense.vendor && expense.category && expense.description && Number(expense.amount) >= 0

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content invoice-modal"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(expense)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{expense.isNew ? 'Create' : 'Edit'}</p>
            <h3>{expense.description || 'Expense'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close expense form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Date" type="date" value={expense.date} onChange={(value) => update('date', value)} />
          <Field label="Vendor / Payee" value={expense.vendor} onChange={(value) => update('vendor', value)} />
          <label className="field">
            <span>Category</span>
            <select value={expense.category} onChange={(event) => update('category', event.target.value)}>
              <option value="payroll">Payroll</option>
              <option value="supplies">Supplies</option>
              <option value="transportation">Transportation</option>
              <option value="equipment">Equipment</option>
              <option value="utilities">Utilities</option>
              <option value="fees">Fees</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Field label="Amount (GYD)" type="number" value={String(expense.amount)} onChange={(value) => update('amount', value)} />
          <Field label="Description" value={expense.description} onChange={(value) => update('description', value)} />
          <Field label="Payment Method" value={expense.paymentMethod} onChange={(value) => update('paymentMethod', value)} />
          <label className="field">
            <span>Status</span>
            <select value={expense.status} onChange={(event) => update('status', event.target.value)}>
              <option value="planned">Planned</option>
              <option value="submitted">Submitted</option>
              <option value="paid">Paid</option>
              <option value="reimbursed">Reimbursed</option>
            </select>
          </label>
          <Field label="Work Order Ref" value={expense.workOrderRef} onChange={(value) => update('workOrderRef', value)} />
          <Field label="Receipt / Document Ref" value={expense.receiptRef} onChange={(value) => update('receiptRef', value)} />
          <label className="field span-2">
            <span>Notes</span>
            <textarea value={expense.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{expense.isNew ? 'Create Expense' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function RecurringExpenseModal({ expense, setExpense, onClose, onSave }) {
  const update = (field, value) => setExpense({ ...expense, [field]: value })
  const canSave = expense.name && expense.category && expense.nextDue && Number(expense.amount) >= 0

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(expense)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{expense.isNew ? 'Create' : 'Edit'}</p>
            <h3>{expense.name || 'Recurring Expense'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close recurring expense form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Name" value={expense.name} onChange={(value) => update('name', value)} />
          <Field label="Vendor / Payee" value={expense.vendor} onChange={(value) => update('vendor', value)} />
          <label className="field">
            <span>Category</span>
            <select value={expense.category} onChange={(event) => update('category', event.target.value)}>
              <option value="payroll">Payroll</option>
              <option value="supplies">Supplies</option>
              <option value="transportation">Transportation</option>
              <option value="equipment">Equipment</option>
              <option value="utilities">Utilities</option>
              <option value="fees">Fees</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Field label="Amount (GYD)" type="number" value={String(expense.amount)} onChange={(value) => update('amount', value)} />
          <label className="field">
            <span>Frequency</span>
            <select value={expense.frequency} onChange={(event) => update('frequency', event.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </label>
          <Field label="Next Due" type="date" value={expense.nextDue} onChange={(value) => update('nextDue', value)} />
          <label className="field">
            <span>Status</span>
            <select value={expense.status} onChange={(event) => update('status', event.target.value)}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{expense.isNew ? 'Create Recurring Expense' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function WorkOrdersView({ workOrders, setWorkOrders, staff, invoices, expenses, staffHours, query, showToast }) {
  const [filter, setFilter] = useState('all')
  const [editingWorkOrder, setEditingWorkOrder] = useState(null)
  const rows = workOrders.filter((wo) => {
    const statusMatch = filter === 'all' || wo.status === filter
    const queryMatch = JSON.stringify(wo).toLowerCase().includes(query.toLowerCase())
    return statusMatch && queryMatch
  })
  const newWorkOrder = () => {
    const nextDate = '2026-05-18'
    setEditingWorkOrder({
      id: `wo${Date.now()}`,
      woNumber: `WO-2026-${String(workOrders.length + 41).padStart(3, '0')}`,
      date: nextDate,
      day: 'Monday',
      arrival: '08:00',
      departure: '11:00',
      staff1: staff[0]?.name ?? '',
      staff2: staff[1]?.name ?? '',
      status: 'scheduled',
      clientRep: '',
      signedDate: '',
      notes: '',
      isNew: true,
    })
  }
  const signOff = (id) => {
    setWorkOrders(workOrders.map((wo) => wo.id === id ? { ...wo, status: 'signed', clientRep: 'Client Rep', signedDate: format(today, 'yyyy-MM-dd') } : wo))
    showToast('Work order signed off.')
  }
  const saveWorkOrder = (workOrder) => {
    const normalized = { ...workOrder }
    delete normalized.isNew
    if (workOrder.isNew) {
      setWorkOrders([normalized, ...workOrders])
      showToast('Work order created.')
    } else {
      setWorkOrders(workOrders.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Work order updated.')
    }
    setEditingWorkOrder(null)
  }
  const deleteWorkOrder = (id) => {
    const workOrder = workOrders.find((item) => item.id === id)
    if (!window.confirm(`Delete ${workOrder?.woNumber || 'this work order'}?`)) return
    setWorkOrders(workOrders.filter((item) => item.id !== id))
    showToast('Work order deleted.')
  }

  return (
    <div className="stack">
      <div className="stat-grid three">
        <Stat label="Total Work Orders" value={workOrders.length} />
        <Stat label="Completed/Signed" value={workOrders.filter((wo) => ['completed', 'signed'].includes(wo.status)).length} tone="green" />
        <Stat label="Pending Signature" value={workOrders.filter((wo) => wo.status !== 'signed').length} tone="orange" />
      </div>
      <Card title="Work Orders" action={<button className="primary" onClick={newWorkOrder}><Plus size={16} /> New Work Order</button>}>
        <FilterTabs items={['all', 'scheduled', 'completed', 'pending-signature', 'signed']} active={filter} setActive={setFilter} />
        <DataTable
          headers={['WO #', 'Date', 'Staff', 'Status', 'Client Rep', 'Action']}
          rows={rows.map((wo) => [
            wo.woNumber,
            `${wo.date} ${wo.arrival}-${wo.departure}`,
            `${wo.staff1} / ${wo.staff2}`,
            statusBadge(wo.status),
            wo.clientRep || 'Pending',
            <div className="row-actions">
              <button onClick={() => setEditingWorkOrder({ ...wo })}><Pencil size={15} /> Edit</button>
              {wo.status !== 'signed' && <button onClick={() => signOff(wo.id)}>Sign off</button>}
              <button className="danger-action" onClick={() => deleteWorkOrder(wo.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      <Card title="Cleaning Checklist">
        <div className="checklist-grid">
          {cleaningTasks.map((task) => <span key={task}><CheckCircle2 size={16} />{task}</span>)}
        </div>
      </Card>
      <Card title="Profit Per Work Order">
        <DataTable
          headers={['Work Order', 'Revenue Linked', 'Labor', 'Expenses', 'Estimated Margin']}
          rows={workOrders.map((wo) => {
            const margin = getWorkOrderMargin(wo, invoices, expenses, staffHours)
            return [
              wo.woNumber,
              money.format(margin.revenue),
              money.format(margin.labor),
              money.format(margin.expenses),
              <strong className={margin.margin >= 0 ? 'positive-money' : 'negative-money'}>{money.format(margin.margin)}</strong>,
            ]
          })}
        />
      </Card>
      {editingWorkOrder && (
        <WorkOrderModal
          workOrder={editingWorkOrder}
          setWorkOrder={setEditingWorkOrder}
          staff={staff}
          onClose={() => setEditingWorkOrder(null)}
          onSave={saveWorkOrder}
        />
      )}
    </div>
  )
}

function WorkOrderModal({ workOrder, setWorkOrder, staff, onClose, onSave }) {
  const update = (field, value) => setWorkOrder({ ...workOrder, [field]: value })
  const canSave = workOrder.woNumber && workOrder.date && workOrder.arrival && workOrder.departure

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(workOrder)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{workOrder.isNew ? 'Create' : 'Edit'}</p>
            <h3>{workOrder.woNumber || 'Work Order'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close work order form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="WO Number" value={workOrder.woNumber} onChange={(value) => update('woNumber', value)} />
          <Field label="Date" type="date" value={workOrder.date} onChange={(value) => update('date', value)} />
          <Field label="Day" value={workOrder.day} onChange={(value) => update('day', value)} />
          <label className="field">
            <span>Status</span>
            <select value={workOrder.status} onChange={(event) => update('status', event.target.value)}>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="pending-signature">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="issue-reported">Issue Reported</option>
            </select>
          </label>
          <Field label="Arrival" type="time" value={workOrder.arrival} onChange={(value) => update('arrival', value)} />
          <Field label="Departure" type="time" value={workOrder.departure} onChange={(value) => update('departure', value)} />
          <label className="field">
            <span>Staff 1</span>
            <select value={workOrder.staff1} onChange={(event) => update('staff1', event.target.value)}>
              {staff.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Staff 2</span>
            <select value={workOrder.staff2} onChange={(event) => update('staff2', event.target.value)}>
              {staff.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}
            </select>
          </label>
          <Field label="Client Rep" value={workOrder.clientRep} onChange={(value) => update('clientRep', value)} />
          <Field label="Signed Date" type="date" value={workOrder.signedDate} onChange={(value) => update('signedDate', value)} />
          <label className="field span-2">
            <span>Notes / Issues</span>
            <textarea value={workOrder.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{workOrder.isNew ? 'Create Work Order' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function TasksView({ tasks, setTasks, staff, showToast }) {
  const [editingTask, setEditingTask] = useState(null)
  const newTask = () => {
    setEditingTask({
      id: `t${Date.now()}`,
      title: 'New operations follow-up',
      description: 'Added from dashboard.',
      priority: 'medium',
      status: 'todo',
      dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
      assignedTo: staff[0]?.name ?? 'Patrick King',
      isNew: true,
    })
  }
  const moveTask = (id, status) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, status } : task))
  }
  const saveTask = (task) => {
    const normalized = { ...task }
    delete normalized.isNew
    if (task.isNew) {
      setTasks([normalized, ...tasks])
      showToast('Task created.')
    } else {
      setTasks(tasks.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Task updated.')
    }
    setEditingTask(null)
  }
  const deleteTask = (id) => {
    const task = tasks.find((item) => item.id === id)
    if (!window.confirm(`Delete ${task?.title || 'this task'}?`)) return
    setTasks(tasks.filter((item) => item.id !== id))
    showToast('Task deleted.')
  }
  return (
    <div className="stack">
      <div className="stat-grid four">
        <Stat label="Total Tasks" value={tasks.length} />
        <Stat label="In Progress" value={tasks.filter((task) => task.status === 'in-progress').length} tone="blue" />
        <Stat label="Overdue" value={tasks.filter(isTaskOverdue).length} tone="red" />
        <Stat label="Completed" value={tasks.filter((task) => task.status === 'done').length} tone="green" />
      </div>
      <div className="board-header">
        <h3>Kanban Board</h3>
        <button className="primary" onClick={newTask}><Plus size={16} /> New Task</button>
      </div>
      <div className="kanban">
        {[
          ['todo', 'To Do'],
          ['in-progress', 'In Progress'],
          ['done', 'Done'],
        ].map(([status, label]) => (
          <section className="kanban-column" key={status}>
            <h4>{label}</h4>
            {tasks.filter((task) => task.status === status).map((task) => (
              <article className={`task-card ${isTaskOverdue(task) ? 'overdue' : ''}`} key={task.id}>
                <div>{priorityBadge(task.priority)}<span>{task.dueDate}</span></div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <footer>
                  <span>{task.assignedTo}</span>
                  <select value={task.status} onChange={(event) => moveTask(task.id, event.target.value)}>
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </footer>
                <div className="task-actions">
                  <button onClick={() => setEditingTask({ ...task })}><Pencil size={14} /> Edit</button>
                  <button className="danger-action" onClick={() => deleteTask(task.id)}><Trash2 size={14} /> Delete</button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
      {editingTask && (
        <TaskModal
          task={editingTask}
          setTask={setEditingTask}
          staff={staff}
          onClose={() => setEditingTask(null)}
          onSave={saveTask}
        />
      )}
    </div>
  )
}

function TaskModal({ task, setTask, staff, onClose, onSave }) {
  const update = (field, value) => setTask({ ...task, [field]: value })
  const canSave = task.title && task.dueDate && task.assignedTo

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(task)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{task.isNew ? 'Create' : 'Edit'}</p>
            <h3>{task.title || 'Task'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close task form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Title" value={task.title} onChange={(value) => update('title', value)} />
          <Field label="Due Date" type="date" value={task.dueDate} onChange={(value) => update('dueDate', value)} />
          <label className="field">
            <span>Priority</span>
            <select value={task.priority} onChange={(event) => update('priority', event.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={task.status} onChange={(event) => update('status', event.target.value)}>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label className="field">
            <span>Assigned To</span>
            <select value={task.assignedTo} onChange={(event) => update('assignedTo', event.target.value)}>
              <option value="Patrick King">Patrick King</option>
              {staff.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}
            </select>
          </label>
          <label className="field span-2">
            <span>Description</span>
            <textarea value={task.description} onChange={(event) => update('description', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{task.isNew ? 'Create Task' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function StaffView({ staff, setStaff, staffHours, setStaffHours, workOrders, showToast }) {
  const [editingStaff, setEditingStaff] = useState(null)
  const [editingHours, setEditingHours] = useState(null)
  const newStaff = () => {
    setEditingStaff({
      id: `s${Date.now()}`,
      name: 'New Staff Member',
      initials: 'NS',
      role: 'Cleaner',
      phone: '592-000-0000',
      nis: 'NIS-00000',
      hireDate: format(today, 'yyyy-MM-dd'),
      wage: 60000,
      status: 'active',
      notes: '',
      isNew: true,
    })
  }
  const saveStaff = (member) => {
    const normalized = {
      ...member,
      initials: getInitials(member.name),
      wage: Number(member.wage) || 0,
    }
    delete normalized.isNew

    if (member.isNew) {
      setStaff([...staff, normalized])
      showToast('Staff member created.')
    } else {
      setStaff(staff.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Staff member updated.')
    }
    setEditingStaff(null)
  }
  const deleteStaff = (id) => {
    const member = staff.find((item) => item.id === id)
    const assignedVisits = workOrders.filter((wo) => [wo.staff1, wo.staff2].includes(member?.name)).length
    const warning = assignedVisits ? ` ${member.name} is assigned to ${assignedVisits} work order(s).` : ''
    if (!window.confirm(`Delete ${member?.name || 'this staff member'}?${warning}`)) return
    setStaff(staff.filter((item) => item.id !== id))
    showToast('Staff member deleted.')
  }
  const newHours = () => {
    setEditingHours({
      id: `h${Date.now()}`,
      date: format(today, 'yyyy-MM-dd'),
      staffName: staff[0]?.name ?? '',
      workOrderRef: workOrders[0]?.woNumber ?? '',
      hours: 0,
      rate: 800,
      status: 'submitted',
      notes: '',
      isNew: true,
    })
  }
  const saveHours = (entry) => {
    const normalized = { ...entry, hours: Number(entry.hours) || 0, rate: Number(entry.rate) || 0 }
    delete normalized.isNew
    if (entry.isNew) {
      setStaffHours([normalized, ...staffHours])
      showToast('Staff hours created.')
    } else {
      setStaffHours(staffHours.map((item) => item.id === normalized.id ? normalized : item))
      showToast('Staff hours updated.')
    }
    setEditingHours(null)
  }
  const deleteHours = (id) => {
    if (!window.confirm('Delete this staff hours entry?')) return
    setStaffHours(staffHours.filter((item) => item.id !== id))
    showToast('Staff hours deleted.')
  }
  const payrollTotal = staffHours.reduce((sum, entry) => sum + Number(entry.hours) * Number(entry.rate), 0)
  return (
    <div className="stack">
      <div className="stat-grid three">
        <Stat label="Total Staff" value={staff.length} />
        <Stat label="Active" value={staff.filter((member) => member.status === 'active').length} tone="green" />
        <Stat label="Tracked Payroll" value={money.format(payrollTotal)} tone="blue" />
      </div>
      <div className="staff-grid">
        {staff.map((member) => (
          <article className="staff-card" key={member.id}>
            <div className="avatar">{member.initials}</div>
            <strong>{member.name}</strong>
            <p>{member.role}</p>
            {statusBadge(member.status)}
            <dl>
              <div><dt>Phone</dt><dd>{member.phone}</dd></div>
              <div><dt>NIS</dt><dd>{member.nis}</dd></div>
              <div><dt>Hired</dt><dd>{member.hireDate}</dd></div>
              <div><dt>Visits</dt><dd>{workOrders.filter((wo) => [wo.staff1, wo.staff2].includes(member.name)).length}</dd></div>
            </dl>
            <div className="staff-actions">
              <button onClick={() => setEditingStaff({ ...member })}><Pencil size={14} /> Edit</button>
              <button className="danger-action" onClick={() => deleteStaff(member.id)}><Trash2 size={14} /> Delete</button>
            </div>
          </article>
        ))}
        <button className="add-card" onClick={newStaff}><Plus size={28} /> Add Staff</button>
      </div>
      <Card title="NIS Contribution Summary">
        <DataTable
          headers={['Staff', 'Role', 'Wage', 'Employer 8.4%', 'Employee 5.6%', 'Total']}
          rows={staff.map((member) => [
            member.name,
            member.role,
            money.format(member.wage),
            money.format(member.wage * 0.084),
            money.format(member.wage * 0.056),
            money.format(member.wage * 0.14),
          ])}
        />
      </Card>
      <Card title="Staff Hours & Payroll" action={<button className="primary" onClick={newHours}><Plus size={16} /> New Hours</button>}>
        <DataTable
          headers={['Date', 'Staff', 'WO', 'Hours', 'Rate', 'Pay', 'Status', 'Actions']}
          rows={staffHours.map((entry) => [
            entry.date,
            entry.staffName,
            entry.workOrderRef,
            entry.hours,
            money.format(entry.rate),
            money.format(Number(entry.hours) * Number(entry.rate)),
            statusBadge(entry.status),
            <div className="row-actions">
              <button onClick={() => setEditingHours({ ...entry })}><Pencil size={15} /> Edit</button>
              <button className="danger-action" onClick={() => deleteHours(entry.id)}><Trash2 size={15} /> Delete</button>
            </div>,
          ])}
        />
      </Card>
      {editingStaff && (
        <StaffModal
          member={editingStaff}
          setMember={setEditingStaff}
          onClose={() => setEditingStaff(null)}
          onSave={saveStaff}
        />
      )}
      {editingHours && (
        <StaffHoursModal
          entry={editingHours}
          setEntry={setEditingHours}
          staff={staff}
          workOrders={workOrders}
          onClose={() => setEditingHours(null)}
          onSave={saveHours}
        />
      )}
    </div>
  )
}

function StaffModal({ member, setMember, onClose, onSave }) {
  const update = (field, value) => setMember({ ...member, [field]: value })
  const canSave = member.name && member.role && member.phone

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(member)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{member.isNew ? 'Create' : 'Edit'}</p>
            <h3>{member.name || 'Staff Member'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close staff form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Name" value={member.name} onChange={(value) => update('name', value)} />
          <Field label="Title / Role" value={member.role} onChange={(value) => update('role', value)} />
          <Field label="Phone" value={member.phone} onChange={(value) => update('phone', value)} />
          <Field label="NIS Number" value={member.nis} onChange={(value) => update('nis', value)} />
          <Field label="Hire Date" type="date" value={member.hireDate} onChange={(value) => update('hireDate', value)} />
          <Field label="Monthly Wage Estimate" type="number" value={String(member.wage)} onChange={(value) => update('wage', value)} />
          <label className="field">
            <span>Status</span>
            <select value={member.status} onChange={(event) => update('status', event.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </label>
          <label className="field span-2">
            <span>Notes / Information</span>
            <textarea value={member.notes || ''} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{member.isNew ? 'Create Staff' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function StaffHoursModal({ entry, setEntry, staff, workOrders, onClose, onSave }) {
  const update = (field, value) => setEntry({ ...entry, [field]: value })
  const canSave = entry.date && entry.staffName && entry.workOrderRef && Number(entry.hours) >= 0 && Number(entry.rate) >= 0

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(entry)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{entry.isNew ? 'Create' : 'Edit'}</p>
            <h3>{entry.staffName || 'Staff Hours'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close staff hours form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Date" type="date" value={entry.date} onChange={(value) => update('date', value)} />
          <label className="field">
            <span>Staff</span>
            <select value={entry.staffName} onChange={(event) => update('staffName', event.target.value)}>
              {staff.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Work Order</span>
            <select value={entry.workOrderRef} onChange={(event) => update('workOrderRef', event.target.value)}>
              {workOrders.map((wo) => <option key={wo.id} value={wo.woNumber}>{wo.woNumber}</option>)}
            </select>
          </label>
          <Field label="Hours" type="number" value={String(entry.hours)} onChange={(value) => update('hours', value)} />
          <Field label="Hourly Rate (GYD)" type="number" value={String(entry.rate)} onChange={(value) => update('rate', value)} />
          <label className="field">
            <span>Status</span>
            <select value={entry.status} onChange={(event) => update('status', event.target.value)}>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label className="field span-2">
            <span>Notes</span>
            <textarea value={entry.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{entry.isNew ? 'Create Hours' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function InventoryView({ inventory, setInventory, query, showToast }) {
  const [editingItem, setEditingItem] = useState(null)
  const [filter, setFilter] = useState('all')
  const filtered = inventory.filter((item) => {
    const stockStatus = Number(item.quantity) <= Number(item.reorderLevel) ? 'low-stock' : 'in-stock'
    const matchesFilter = filter === 'all' || filter === stockStatus || item.category.toLowerCase() === filter
    const matchesQuery = JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })
  const categories = ['all', 'low-stock', 'Restroom', 'Waste', 'Chemicals', 'Equipment'].map((item) => item.toLowerCase())
  const newItem = () => {
    setEditingItem({
      id: `inv${Date.now()}`,
      item: 'New supply item',
      category: 'Restroom',
      unit: 'units',
      quantity: 0,
      reorderLevel: 0,
      supplier: '',
      lastPurchased: format(today, 'yyyy-MM-dd'),
      unitCost: 0,
      notes: '',
      isNew: true,
    })
  }
  const saveItem = (item) => {
    const normalized = {
      ...item,
      quantity: Number(item.quantity) || 0,
      reorderLevel: Number(item.reorderLevel) || 0,
      unitCost: Number(item.unitCost) || 0,
    }
    delete normalized.isNew
    if (item.isNew) {
      setInventory([normalized, ...inventory])
      showToast('Inventory item created.')
    } else {
      setInventory(inventory.map((existing) => existing.id === normalized.id ? normalized : existing))
      showToast('Inventory item updated.')
    }
    setEditingItem(null)
  }
  const deleteItem = (id) => {
    const item = inventory.find((existing) => existing.id === id)
    if (!window.confirm(`Delete ${item?.item || 'this inventory item'}?`)) return
    setInventory(inventory.filter((existing) => existing.id !== id))
    showToast('Inventory item deleted.')
  }
  const lowStock = inventory.filter((item) => Number(item.quantity) <= Number(item.reorderLevel))

  return (
    <div className="stack">
      <div className="stat-grid four">
        <Stat label="Inventory Items" value={inventory.length} />
        <Stat label="Low Stock" value={lowStock.length} tone={lowStock.length ? 'red' : 'green'} />
        <Stat label="Inventory Value" value={money.format(inventory.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0))} tone="blue" />
        <Stat label="Suppliers" value={new Set(inventory.map((item) => item.supplier).filter(Boolean)).size} tone="gold" />
      </div>
      <Card title="Supplies Inventory" action={<button className="primary" onClick={newItem}><Plus size={16} /> New Item</button>}>
        <FilterTabs items={categories} active={filter} setActive={setFilter} />
        <DataTable
          headers={['Item', 'Category', 'On Hand', 'Reorder Level', 'Supplier', 'Last Purchased', 'Value', 'Status', 'Actions']}
          rows={filtered.map((item) => {
            const low = Number(item.quantity) <= Number(item.reorderLevel)
            return [
              item.item,
              item.category,
              `${item.quantity} ${item.unit}`,
              `${item.reorderLevel} ${item.unit}`,
              item.supplier,
              item.lastPurchased,
              money.format(Number(item.quantity) * Number(item.unitCost)),
              statusBadge(low ? 'low-stock' : 'in-stock'),
              <div className="row-actions">
                <button onClick={() => setEditingItem({ ...item })}><Pencil size={15} /> Edit</button>
                <button className="danger-action" onClick={() => deleteItem(item.id)}><Trash2 size={15} /> Delete</button>
              </div>,
            ]
          })}
        />
      </Card>
      {editingItem && (
        <InventoryModal
          item={editingItem}
          setItem={setEditingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveItem}
        />
      )}
    </div>
  )
}

function InventoryModal({ item, setItem, onClose, onSave }) {
  const update = (field, value) => setItem({ ...item, [field]: value })
  const canSave = item.item && item.category && item.unit

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal-content"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSave) onSave(item)
        }}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">{item.isNew ? 'Create' : 'Edit'}</p>
            <h3>{item.item || 'Inventory Item'}</h3>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close inventory form">
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Item" value={item.item} onChange={(value) => update('item', value)} />
          <Field label="Category" value={item.category} onChange={(value) => update('category', value)} />
          <Field label="Unit" value={item.unit} onChange={(value) => update('unit', value)} />
          <Field label="Quantity On Hand" type="number" value={String(item.quantity)} onChange={(value) => update('quantity', value)} />
          <Field label="Reorder Level" type="number" value={String(item.reorderLevel)} onChange={(value) => update('reorderLevel', value)} />
          <Field label="Supplier" value={item.supplier} onChange={(value) => update('supplier', value)} />
          <Field label="Last Purchased" type="date" value={item.lastPurchased} onChange={(value) => update('lastPurchased', value)} />
          <Field label="Unit Cost (GYD)" type="number" value={String(item.unitCost)} onChange={(value) => update('unitCost', value)} />
          <label className="field span-2">
            <span>Notes</span>
            <textarea value={item.notes} onChange={(event) => update('notes', event.target.value)} />
          </label>
        </div>
        <footer className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={!canSave}>{item.isNew ? 'Create Item' : 'Save Changes'}</button>
        </footer>
      </form>
    </div>
  )
}

function DocumentsView({ documents, setDocuments, query, showToast }) {
  const [category, setCategory] = useState('all')
  const cats = ['all', 'Compliance', 'Finance', 'Operations', 'HR', 'Product', 'Strategy', 'System']
  const filtered = documents.filter((doc) => {
    const catMatch = category === 'all' || doc.category === category
    const queryMatch = JSON.stringify(doc).toLowerCase().includes(query.toLowerCase())
    return catMatch && queryMatch
  })
  const addDocument = () => {
    setDocuments([{ id: `d${Date.now()}`, filename: 'Uploaded document placeholder.pdf', category: 'Operations', type: 'PDF', size: '0 KB', modified: format(today, 'yyyy-MM-dd'), notes: 'Ready for Google Drive upload' }, ...documents])
    showToast('Document record added.')
  }
  return (
    <div className="stack">
      <div className="stat-grid four">
        <Stat label="Total Documents" value={documents.length} />
        <Stat label="PDFs" value={documents.filter((doc) => doc.type === 'PDF').length} tone="red" />
        <Stat label="Word Docs" value={documents.filter((doc) => doc.type === 'DOCX').length} tone="blue" />
        <Stat label="Storage" value="Drive ready" tone="green" />
      </div>
      <button className="upload-zone" onClick={addDocument}>
        <FolderOpen size={30} />
        <strong>Drop files here or click to add a document record</strong>
        <span>Connect Google Drive in Settings to upload files to live storage.</span>
      </button>
      <Card title="Document Library">
        <FilterTabs items={cats} active={category} setActive={setCategory} />
        <DataTable
          headers={['File', 'Category', 'Type', 'Modified', 'Notes']}
          rows={filtered.map((doc) => [doc.filename, doc.category, doc.type, doc.modified, doc.notes])}
        />
      </Card>
    </div>
  )
}

function MessagesView({ messages, setMessages, tasks, setTasks, config, setConfig, metrics, showToast }) {
  const [draft, setDraft] = useState('/fig task Confirm signed copies for May work orders')
  const sendDemo = () => {
    const message = {
      id: `m${Date.now()}`,
      source: 'Slack demo',
      sender: 'Patrick King',
      text: draft,
      timestamp: format(today, 'yyyy-MM-dd HH:mm'),
      processed: true,
    }
    setMessages([message, ...messages])
    const taskText = draft.replace('/fig', '').trim()
    if (taskText.startsWith('task')) {
      setTasks([{ id: `t${Date.now()}`, title: taskText.replace('task', '').trim(), description: 'Created from message feed.', priority: 'medium', status: 'todo', dueDate: format(addDays(today, 3), 'yyyy-MM-dd'), assignedTo: 'Patrick King' }, ...tasks])
    }
    showToast('Message processed.')
  }
  const syncSlackRecords = async () => {
    try {
      const response = await fetch('/.netlify/functions/slack-command')
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.error || 'Unable to sync Slack records.')
      }
      const inbound = (result.records || []).map((record) => ({
        id: record.id,
        source: record.source || 'Slack',
        sender: record.sender || 'Slack user',
        text: record.text,
        timestamp: record.timestamp ? format(parseISO(record.timestamp), 'yyyy-MM-dd HH:mm') : format(today, 'yyyy-MM-dd HH:mm'),
        processed: Boolean(record.processed),
        command: record.command,
        payload: record.payload,
      }))
      const existingIds = new Set(messages.map((message) => message.id))
      const fresh = inbound.filter((record) => !existingIds.has(record.id))
      setMessages([...fresh, ...messages])
      const newTasks = fresh
        .filter((record) => record.command === 'task' && record.payload)
        .map((record) => ({
          id: `task-${record.id}`,
          title: record.payload,
          description: `Created from Slack by ${record.sender}.`,
          priority: 'medium',
          status: 'todo',
          dueDate: format(addDays(today, 3), 'yyyy-MM-dd'),
          assignedTo: 'Patrick King',
        }))
      if (newTasks.length) {
        setTasks([...newTasks, ...tasks])
      }
      showToast(fresh.length ? `Synced ${fresh.length} Slack record(s).` : 'No new Slack records.')
    } catch (error) {
      showToast(error.message || 'Slack sync failed.')
    }
  }
  return (
    <div className="messages-layout">
      <div className="stack">
        <Card
          title="Slack Message Feed"
          action={
            <div className="action-row">
              <button onClick={syncSlackRecords}>Sync Slack</button>
              <button className={config.slackConnected ? 'success' : 'primary'} onClick={() => setConfig({ ...config, slackConnected: !config.slackConnected })}>{config.slackConnected ? 'Connected' : 'Connect Demo'}</button>
            </div>
          }
        >
          <div className="compose-row">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendDemo()} />
            <button onClick={sendDemo}>Send</button>
          </div>
          {messages.map((message) => (
            <article className="message-card" key={message.id}>
              <div>
                <strong>{message.sender}</strong>
                <span>{message.timestamp}</span>
              </div>
              <p>{message.text}</p>
              {message.processed && <small>Processed</small>}
            </article>
          ))}
        </Card>
      </div>
      <aside className="side-stack">
        <Card title="Slack Commands">
          <Command code="/fig task <description>" text="Creates a task" />
          <Command code="/fig wo <date> <staff1> <staff2>" text="Captures a work order update" />
          <Command code="/fig note <text>" text="Saves an operational note" />
          <Command code="/fig status" text={`Replies with ${metrics.overdueTasks} overdue tasks and ${metrics.pendingSignoffs} pending sign-offs`} />
        </Card>
        <Card title="Google + Slack Flow">
          <Command code="Slack channel" text="Staff send updates, notes, and work order details." />
          <Command code="Google Sheets" text="Structured dashboard records are stored in the workbook." />
          <Command code="Google Drive" text="Uploaded PDFs, photos, and signed files are stored in Drive." />
        </Card>
      </aside>
    </div>
  )
}

function SettingsView({ config, setConfig, sendSlackMessage, showToast }) {
  const save = () => {
    setConfig({ ...config, googleConnected: Boolean(config.googleClientId && config.sheetId) })
    showToast('Configuration saved locally.')
  }
  return (
    <div className="settings-grid">
      <Card title="Integration Status">
        <StatusLine label="Google Auth" active={config.googleConnected} />
        <StatusLine label="Google Sheets" active={config.googleConnected} />
        <StatusLine label="Google Drive" active={config.googleConnected} />
        <StatusLine label="Slack" active={config.slackConnected || Boolean(config.slackWebhookUrl || config.slackChannelId)} />
      </Card>
      <Card title="Google API Configuration">
        <Field label="OAuth Client ID" value={config.googleClientId} onChange={(value) => setConfig({ ...config, googleClientId: value })} />
        <Field label="Spreadsheet ID" value={config.sheetId} onChange={(value) => setConfig({ ...config, sheetId: value })} />
        <button className="primary" onClick={save}>Save Configuration</button>
      </Card>
      <Card title="Slack Configuration">
        <Field label="Slack Webhook URL" type="password" value={config.slackWebhookUrl} onChange={(value) => setConfig({ ...config, slackWebhookUrl: value })} />
        <Field label="Channel ID" value={config.slackChannelId} onChange={(value) => setConfig({ ...config, slackChannelId: value })} />
        <p className="muted-copy">For deployment, set `SLACK_WEBHOOK_URL` in Netlify environment variables. The field above is useful for local testing with Netlify Dev.</p>
        <button className="primary" onClick={() => { setConfig({ ...config, slackConnected: Boolean(config.slackWebhookUrl || config.slackChannelId) }); showToast('Slack configuration saved locally.') }}>Save Slack Config</button>
        <button className="secondary-action" onClick={() => sendSlackMessage('FIG Operations Dashboard test: Slack alerts are connected.')}>Send Test Message</button>
      </Card>
      <Card title="Data Privacy">
        <p className="muted-copy">This fresh build runs as a static app. Demo data stays in the browser until Google Sheets and Drive are connected. Do not publish private staff or NIS data in public screenshots.</p>
      </Card>
    </div>
  )
}

function Card({ title, action, children }) {
  return (
    <section className="card">
      <header className="card-head">
        <h3>{title}</h3>
        {action}
      </header>
      {children}
    </section>
  )
}

function ChartFrame({ children }) {
  return <div className="chart-frame"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
}

function Stat({ label, value, tone = 'navy' }) {
  return <article className={`stat ${tone}`}><p>{label}</p><strong>{value}</strong></article>
}

function FilterTabs({ items, active, setActive }) {
  return <div className="filter-tabs">{items.map((item) => <button className={active === item ? 'active' : ''} key={item} onClick={() => setActive(item)}>{item}</button>)}</div>
}

function DataTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function MiniTable({ title, rows }) {
  return (
    <Card title={title}>
      <div className="mini-table">
        {rows.map((row, index) => <div key={index}>{row.map((cell, i) => <span key={i}>{cell}</span>)}</div>)}
      </div>
    </Card>
  )
}

function EmptyState({ text }) {
  return <p className="empty-state">{text}</p>
}

function ActivityList({ workOrders, invoices, messages }) {
  const items = [
    ...workOrders.slice(0, 2).map((wo) => ({ icon: ClipboardCheck, text: `${wo.woNumber} ${wo.status}`, meta: wo.date })),
    ...invoices.slice(0, 2).map((invoice) => ({ icon: Banknote, text: `${invoice.invoiceNo} ${money.format(invoice.amount)}`, meta: invoice.status })),
    ...messages.slice(0, 2).map((message) => ({ icon: MessageSquareText, text: message.text, meta: message.sender })),
  ]
  return <div className="activity-list">{items.map((item) => <div key={`${item.text}-${item.meta}`}><item.icon size={18} /><span>{item.text}</span><small>{item.meta}</small></div>)}</div>
}

function Command({ code, text }) {
  return <div className="command-row"><code>{code}</code><span>{text}</span></div>
}

function Field({ label, value, onChange, type = 'text' }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function StatusLine({ label, active }) {
  return <div className="status-line"><span className={`dot ${active ? 'good' : ''}`}></span><strong>{label}</strong><em>{active ? 'Connected' : 'Not connected'}</em></div>
}

function statusBadge(status) {
  return <span className={`badge ${String(status).replace(/\s+/g, '-').toLowerCase()}`}>{status}</span>
}

function priorityBadge(priority) {
  return <span className={`badge priority-${priority}`}>{priority}</span>
}

function getInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST'
}

function getWorkOrderMargin(workOrder, invoices, expenses, staffHours) {
  const revenue = invoices
    .filter((invoice) => invoice.woRefs.includes(workOrder.woNumber))
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const labor = staffHours
    .filter((entry) => entry.workOrderRef === workOrder.woNumber)
    .reduce((sum, entry) => sum + Number(entry.hours) * Number(entry.rate), 0)
  const linkedExpenses = expenses
    .filter((expense) => expense.workOrderRef.includes(workOrder.woNumber))
    .reduce((sum, expense) => sum + expense.amount, 0)

  return {
    revenue,
    labor,
    expenses: linkedExpenses,
    margin: revenue - labor - linkedExpenses,
  }
}

function getMetrics(invoices, expenses, workOrders, tasks, messages) {
  const finance = getFinanceTotals(invoices, expenses)
  return {
    monthlyBilled: 186000,
    collected: finance.collected,
    outstanding: finance.outstanding,
    monthVisits: workOrders.filter((wo) => wo.date.startsWith('2026-05')).length,
    pendingSignoffs: workOrders.filter((wo) => wo.status !== 'signed').length,
    overdueTasks: tasks.filter(isTaskOverdue).length,
    unreadMessages: messages.filter((message) => !message.processed).length,
  }
}

function getFinanceTotals(invoices, expenses = []) {
  const billed = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const collected = invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  const outstanding = billed - collected
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  return { billed, collected, outstanding, expenses: expenseTotal, net: collected - expenseTotal, rate: billed ? Math.round((collected / billed) * 100) : 0 }
}

function getExpenseTotals(expenses) {
  return expenses.reduce((totals, expense) => {
    const amount = Number(expense.amount) || 0
    return {
      ...totals,
      total: totals.total + amount,
      [expense.category]: (totals[expense.category] || 0) + amount,
    }
  }, {
    total: 0,
    payroll: 0,
    supplies: 0,
    transportation: 0,
    equipment: 0,
    utilities: 0,
    fees: 0,
    other: 0,
  })
}

function expenseBreakdown(expenses) {
  const totals = getExpenseTotals(expenses)
  const categories = [
    ['payroll', 'Payroll', brand.orange],
    ['supplies', 'Supplies', brand.gold],
    ['transportation', 'Transportation', brand.blue],
    ['equipment', 'Equipment', brand.purple],
    ['utilities', 'Utilities', brand.green],
    ['fees', 'Fees', brand.red],
    ['other', 'Other', '#64748b'],
  ]
  return categories
    .map(([category, label, color]) => ({
      category,
      label,
      color,
      value: totals[category] || 0,
      percent: totals.total ? Math.max(4, Math.round(((totals[category] || 0) / totals.total) * 100)) : 0,
    }))
    .filter((item) => item.value > 0)
}

function revenueData(invoices) {
  const base = [
    { month: 'Jan', billed: 140000, collected: 140000 },
    { month: 'Feb', billed: 208800, collected: 186000 },
    { month: 'Mar', billed: 186000, collected: 120000 },
    { month: 'Apr', billed: 198700, collected: 0 },
    { month: 'May', billed: 186000, collected: 0 },
    { month: 'Jun', billed: 186000, collected: 0 },
  ]
  const paid = invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  base[1].collected = paid
  return base
}

function paymentBreakdown(invoices) {
  return [
    { name: 'Paid', value: invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0), color: brand.green },
    { name: 'Sent', value: invoices.filter((i) => i.status === 'sent').reduce((sum, i) => sum + i.amount, 0), color: brand.gold },
    { name: 'Draft', value: invoices.filter((i) => i.status === 'draft').reduce((sum, i) => sum + i.amount, 0), color: brand.blue },
  ]
}

function isOverdue(invoice) {
  return invoice.status !== 'paid' && parseISO(invoice.dueDate) < today
}

function isTaskOverdue(task) {
  return task.status !== 'done' && parseISO(task.dueDate) < today
}

function getEventsForMonth(month, workOrders, tasks, invoices) {
  const events = [
    ...workOrders.map((wo) => ({ id: wo.id, date: wo.date, type: 'visit', title: wo.woNumber, detail: `${wo.staff1} and ${wo.staff2}` })),
    ...tasks.map((task) => ({ id: task.id, date: task.dueDate, type: 'task', title: task.title, detail: task.assignedTo })),
    ...invoices.map((invoice) => ({ id: invoice.id, date: invoice.dueDate, type: 'invoice', title: invoice.invoiceNo, detail: money.format(invoice.amount) })),
    { id: 'renewal', date: '2027-01-19', type: 'compliance', title: 'Business registration renewal', detail: 'Certificate no. 278040' },
  ]
  return events.filter((event) => isSameMonth(parseISO(event.date), month) || Math.abs(parseISO(event.date) - month) < 1000 * 60 * 60 * 24 * 45)
}

function calendarCells(month) {
  const start = startOfMonth(month)
  const first = addDays(start, -getDay(start))
  const total = 42
  return Array.from({ length: total }, (_, index) => addDays(first, index))
}

export default App
