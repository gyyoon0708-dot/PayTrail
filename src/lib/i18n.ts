import { useStore } from '../store';
import { AppLanguage } from '../types';

type TranslationKeys =
    // Header
    | 'appSubtitle'
    | 'settings'
    | 'dashboard'
    | 'privacyModeOn'
    | 'privacyModeOff'

    // SummaryPanel
    | 'expectedGross'
    | 'received'
    | 'overdue'
    | 'aging30Days'

    // Settings
    | 'preferences'
    | 'language'
    | 'languageKo'
    | 'languageEn'
    | 'languageJa'
    | 'languageEs'
    | 'currencyProtocol'
    | 'audioKaChing'
    | 'audioDescription'
    | 'dataManagement'
    | 'upgradeUnlockExport'
    | 'pro'
    | 'exportDateRange'
    | 'exportAllTime'
    | 'exportThisYear'
    | 'exportLast3Months'
    | 'syncToGoogleDrive'

    // Subscription
    | 'monthlyPass'
    | 'mo'
    | 'yearlyPass'
    | 'yr'
    | 'annualPass'
    | 'proFeatures'
    | 'unlimitedRecurring'
    | 'unlimitedTasks'
    | 'proExportPDF'
    | 'advancedExport'
    | 'clientAnalytics'
    | 'upgradeToPro'
    | 'upgradeDesc'
    | 'subscribe'
    | 'save20'
    | 'unlockPotential'
    | 'googleDriveSync'

    // TaskBottom / ListItem
    | 'noTasks'
    | 'noTasksScheduled'
    | 'addTaskForDate'
    | 'remind'
    | 'remindTemplate'
    | 'proRemindTemplate'
    | 'freeRemindTemplate'
    | 'systemGeneratedMessage'
    | 'remindMessageCopied'
    | 'markAsPaid'
    | 'partial'
    | 'paid'
    | 'remaining'
    | 'quickPay'

    // Modals
    | 'newTask'
    | 'clientCompany'
    | 'contactOptional'
    | 'amount'
    | 'calcGross'
    | 'calcNet'
    | 'calcHint'
    | 'receivedAmount'
    | 'receivedHint'
    | 'dueDate'
    | 'workDate'
    | 'workDateStart'
    | 'workDateEnd'
    | 'workDateHint'
    | 'memo'
    | 'setRecurring'
    | 'none'
    | 'weekly'
    | 'monthly'
    | 'monthEnd'
    | 'save'
    | 'deleteTask'
    | 'restoreDraft'

    // Status
    | 'statusScheduled'
    | 'statusWaiting'
    | 'statusOverdue'
    | 'statusPaid'
    | 'undoPayment'
    | 'edit'
    | 'delete'
    | 'editTask'
    | 'tasks'
    | 'emptySummaryTasks'
    ;

const translations: Record<AppLanguage, Record<TranslationKeys, string>> = {
    ko: {
        appSubtitle: '모든 정산을 한 눈에',
        settings: '설정',
        dashboard: '대시보드',
        privacyModeOn: '프라이버시 켜짐',
        privacyModeOff: '프라이버시 꺼짐',

        expectedGross: '예상 금액 (총액)',
        received: '수령 완료',
        overdue: '연체',
        aging30Days: '30일 초과 악성',

        preferences: '환경 설정',
        language: '언어 설정',
        languageKo: '한국어',
        languageEn: 'English (영어)',
        languageJa: '日本語 (일본어)',
        languageEs: 'Español (스페인어)',
        currencyProtocol: '표시 통화',
        audioKaChing: 'Ka-ching 소리 효과',
        audioDescription: '입금 완료 시 소리 재생',
        dataManagement: '데이터 관리',
        upgradeUnlockExport: '내보내기 잠금 해제',
        pro: 'PRO',
        exportDateRange: '내보내기 날짜 범위',
        exportAllTime: '전체 기간',
        exportThisYear: '올해',
        exportLast3Months: '최근 3개월',
        syncToGoogleDrive: '구글 드라이브 동기화',

        monthlyPass: '월간 패스',
        mo: '/월',
        yearlyPass: '연간 패스',
        yr: '/년',
        annualPass: '연간 패스',
        save20: '20% 절약',
        proFeatures: '프로 기능',
        unlimitedRecurring: '무제한 반복 등록',
        unlimitedTasks: '무제한 반복 알림 (무료는 5개 제한)',
        proExportPDF: '비즈니스 PDF 및 CSV 내보내기',
        advancedExport: '고급 PDF & CSV 내보내기',
        clientAnalytics: '클라이언트 지연 데이터 분석',
        upgradeToPro: 'Pro로 업그레이드',
        upgradeDesc: 'PayTrail 관리 시스템의 모든 기능을 잠금 해제하세요.',
        subscribe: '구독하기',
        unlockPotential: 'PayTrail 관리 시스템의 모든 기능을 사용하세요.',
        googleDriveSync: '구글 드라이브 동기화 (백업)',

        noTasks: '이 날짜에는 등록된 일정이 없습니다.',
        noTasksScheduled: '이 날짜에는 등록된 일정이 없습니다.',
        addTaskForDate: '이 날짜에 일정 추가',
        remind: '리마인드 송신',
        remindTemplate: '안녕하세요, 정산 대금이 지연되어 리마인드 연락 드립니다. 확인 부탁드리겠습니다.',
        proRemindTemplate: '안녕하세요, {company} 담당자님.\n{dueDate}자로 예정되었던 건에 대해 정산이 지연되고 있어 확인 부탁드립니다.\n감사합니다.',
        freeRemindTemplate: '안녕하세요, {company} 담당자님.\n정산 건 확인 부탁드립니다.',
        systemGeneratedMessage: '[본 메시지는 프리랜서 정산 관리 시스템 \'PayTrail\'에서 자동 생성되었습니다]',
        remindMessageCopied: '리마인드 메시지가 클립보드에 복사되었습니다!',
        markAsPaid: '입금 완료 처리!',
        partial: '부분입금',
        paid: '완료',
        remaining: '잔여',
        quickPay: '빠른 정산',

        newTask: '새 일정 추가',
        editTask: '일정 수정',
        clientCompany: '클라이언트 (회사명) *',
        contactOptional: '담당자 이름 (선택)',
        amount: '금액 *',
        calcGross: '공급가 (그로스)',
        calcNet: '실수령 (넷)',
        calcHint: '내부적으로 3.3% 역산되어 자동 저장됩니다.',
        receivedAmount: '입금된 금액',
        receivedHint: '일부 입금 시 금액을 입력. (세후 금액 도달 시 완료처리)',
        dueDate: '예정일 (지급 기한) *',
        workDate: '작업일',
        workDateStart: '작업/강의 시작일',
        workDateEnd: '작업/강의 종료일',
        workDateHint: '작업을 수행한 날짜 또는 기간을 지정합니다.',
        memo: '메모 (계약 내용 등)',
        setRecurring: '반복 알림 설정',
        none: '없음',
        weekly: '매주',
        monthly: '매월 (같은 날짜)',
        monthEnd: '매월 말일',
        save: '저장',
        deleteTask: '일정 삭제',
        restoreDraft: '작성 중이던 임시저장 내역을 불러왔습니다.',

        statusScheduled: '예정',
        statusWaiting: '대기중',
        statusOverdue: '연체',
        statusPaid: '완료',
        undoPayment: '완료 취소 (되돌리기)',
        edit: '수정',
        delete: '삭제',
        tasks: '건',
        emptySummaryTasks: '해당되는 일정이 없습니다.',
    },
    en: {
        appSubtitle: 'Trace every penny',
        settings: 'Settings',
        dashboard: 'Dashboard',
        privacyModeOn: 'Privacy On',
        privacyModeOff: 'Privacy Off',

        expectedGross: 'Expected Gross',
        received: 'Received',
        overdue: 'Overdue',
        aging30Days: '30+ Days Aging',

        preferences: 'Preferences',
        language: 'Language',
        languageKo: '한국어 (Korean)',
        languageEn: 'English',
        languageJa: '日本語 (Japanese)',
        languageEs: 'Español (Spanish)',
        currencyProtocol: 'Currency Protocol',
        audioKaChing: 'Ka-ching Audio',
        audioDescription: 'Play sound when task marks as paid',
        dataManagement: 'Data Management',
        upgradeUnlockExport: 'Upgrade to unlock Export',
        pro: 'PRO',
        exportDateRange: 'Export Date Range Filter',
        exportAllTime: 'All Time',
        exportThisYear: 'This Year',
        exportLast3Months: 'Last 3 Months',
        syncToGoogleDrive: 'Sync to Google Drive',

        monthlyPass: 'Monthly Pass',
        mo: '/mo',
        yearlyPass: 'Yearly Pass',
        yr: '/yr',
        annualPass: 'Annual Pass',
        save20: 'Save 20%',
        proFeatures: 'Pro Features',
        unlimitedRecurring: 'Unlimited Recurring Tasks',
        unlimitedTasks: 'Unlimited Recurring Tasks (Free is limited to 5)',
        proExportPDF: 'Professional PDF & CSV Export',
        advancedExport: 'Advanced PDF & CSV Export',
        clientAnalytics: 'Client Delay Analytics',
        upgradeToPro: 'Upgrade Profile',
        upgradeDesc: 'Unlock the full potential of PayTrail Management System.',
        subscribe: 'Subscribe',
        unlockPotential: 'Unlock the full potential of PayTrail.',
        googleDriveSync: 'Google Drive Sync (Backup)',

        noTasks: 'No tasks found for this date.',
        noTasksScheduled: 'No tasks scheduled for this day.',
        addTaskForDate: 'Add Task for Date',
        remind: 'Remind',
        remindTemplate: 'Hello, this is a gentle reminder regarding the overdue payment. Please review at your earliest convenience.',
        proRemindTemplate: 'Hello {company},\nThis is a reminder that the payment originally scheduled for {dueDate} is delayed. Please check your system.\nThank you.',
        freeRemindTemplate: 'Hello {company},\nPlease check the payment status for our recent project.',
        systemGeneratedMessage: '[This message was automatically generated by PayTrail Freelance Management]',
        remindMessageCopied: 'Remind message copied to clipboard!',
        markAsPaid: 'Mark as Paid!',
        partial: 'Partial',
        paid: 'Paid',
        remaining: 'Remaining',
        quickPay: 'Quick Pay',

        newTask: 'New Task',
        editTask: 'Edit Task',
        clientCompany: 'Client / Company *',
        contactOptional: 'Contact Name (Optional)',
        amount: 'Amount *',
        calcGross: 'Gross (3.3% inc)',
        calcNet: 'Net',
        calcHint: 'The 3.3% tax logic is calculated automatically.',
        receivedAmount: 'Received Amount',
        receivedHint: 'Progressive partial payments (Status locks PAID when met)',
        dueDate: 'Payment Due Date *',
        workDate: 'Work Date',
        workDateStart: 'Work / Lecture Start Date',
        workDateEnd: 'Work / Lecture End Date',
        workDateHint: 'Specify the dates you actually perform the work or lecture.',
        memo: 'Memo (Contract details)',
        setRecurring: 'Set as Recurring',
        none: 'None',
        weekly: 'Weekly',
        monthly: 'Monthly',
        monthEnd: 'Month End',
        save: 'Save Task',
        deleteTask: 'Delete Task',
        restoreDraft: 'Restored your unsaved draft.',

        statusScheduled: 'Scheduled',
        statusWaiting: 'Waiting',
        statusOverdue: 'Overdue',
        statusPaid: 'Paid',
        undoPayment: 'Undo Payment',
        edit: 'Edit',
        delete: 'Delete',
        tasks: 'tasks',
        emptySummaryTasks: 'No tasks found.',
    },
    ja: {
        appSubtitle: 'すべての報酬を一目で',
        settings: '設定',
        dashboard: 'ダッシュボード',
        privacyModeOn: 'プライバシー オン',
        privacyModeOff: 'プライバシー オフ',

        expectedGross: '予想（総額）',
        received: '受領済み',
        overdue: '未払い（延滞）',
        aging30Days: '30日超過',

        preferences: '環境設定',
        language: '言語設定',
        languageKo: '한국어 (韓国語)',
        languageEn: 'English (英語)',
        languageJa: '日本語',
        languageEs: 'Español (スペイン語)',
        currencyProtocol: '表示通貨',
        audioKaChing: 'Ka-ching サウンド',
        audioDescription: '支払完了時に音を鳴らす',
        dataManagement: 'データ管理',
        upgradeUnlockExport: 'エクスポートのロックを解除',
        pro: 'PRO',
        exportDateRange: 'エクスポート期間',
        exportAllTime: '全期間',
        exportThisYear: '今年',
        exportLast3Months: '過去3ヶ月',
        syncToGoogleDrive: 'Google Drive 同期',

        monthlyPass: '月間プラン',
        mo: '/月',
        yearlyPass: '年間プラン',
        yr: '/年',
        annualPass: '年間パス',
        save20: '20% お得',
        proFeatures: 'プロ機能',
        unlimitedRecurring: '無制限の繰り返しタスク',
        unlimitedTasks: '無制限の繰り返しタスク（無料版は5個まで）',
        proExportPDF: 'PDF & CSV エクスポート',
        advancedExport: '高度なPDF & CSVエクスポート',
        clientAnalytics: 'クライアント遅延分析',
        upgradeToPro: 'Proにアップグレード',
        upgradeDesc: 'PayTrail管理システムのすべての機能を活用する',
        subscribe: '購読する',
        unlockPotential: 'PayTrail管理システムのすべての機能を活用する',
        googleDriveSync: 'Google Drive 動機 (バックアップ)',

        noTasks: 'この日付のタスクはありません。',
        noTasksScheduled: 'この日付のスケジュールはありません。',
        addTaskForDate: 'この日付にタスクを追加',
        remind: 'リマインド',
        remindTemplate: 'お世話になっております。お支払いが遅れているようですので、ご確認をお願いいたします。',
        proRemindTemplate: 'お世話になっております。{company}のご担当者様。\n{dueDate}に予定されていたお支払いが遅延しております。ご確認のほどよろしくお願いいたします。',
        freeRemindTemplate: 'お世話になっております。{company}のご担当者様。\nお支払いについてご確認をお願いいたします。',
        systemGeneratedMessage: '[このメッセージはPayTrail精算管理システムから自動生成されました]',
        remindMessageCopied: 'クリップボードにコピーしました！',
        markAsPaid: '完了としてマーク！',
        partial: '一部受領',
        paid: '完了',
        remaining: '残り',
        quickPay: '即時完了',

        newTask: '新しいタスク',
        editTask: 'タスクの編集',
        clientCompany: 'クライアント / 会社名 *',
        contactOptional: '担当者名（任意）',
        amount: '金額 *',
        calcGross: '総額（Gross）',
        calcNet: '手取り（Net）',
        calcHint: '税金(3.3%)は自動計算されます。',
        receivedAmount: '受領額',
        receivedHint: '分割支払い時の入力（税引き後金額に達すると完了）',
        dueDate: '支払期限 *',
        workDate: '作業日',
        workDateStart: '作業/講義 開始日',
        workDateEnd: '作業/講義 終了日',
        workDateHint: '実際に作業や講義を行う日付を指定します。',
        memo: 'メモ（契約詳細など）',
        setRecurring: '繰り返し設定',
        none: 'なし',
        weekly: '毎週',
        monthly: '毎月',
        monthEnd: '毎月末',
        save: '保存',
        deleteTask: 'タスクの削除',
        restoreDraft: '下書きを復元しました。',

        statusScheduled: '予定',
        statusWaiting: '待機中',
        statusOverdue: '延滞',
        statusPaid: '完了',
        undoPayment: '完了取消 (元に戻す)',
        edit: '編集',
        delete: '削除',
        tasks: '件',
        emptySummaryTasks: '該当するスケジュールはありません。',
    },
    es: {
        appSubtitle: 'Rastrea cada centavo',
        settings: 'Ajustes',
        dashboard: 'Panel',
        privacyModeOn: 'Privacidad Act.',
        privacyModeOff: 'Privacidad Des.',

        expectedGross: 'Ingreso Esperado',
        received: 'Recibido',
        overdue: 'Atrasado',
        aging30Days: '+30 Días Mora',

        preferences: 'Preferencias',
        language: 'Idioma',
        languageKo: '한국어 (Coreano)',
        languageEn: 'English (Inglés)',
        languageJa: '日本語 (Japonés)',
        languageEs: 'Español',
        currencyProtocol: 'Moneda',
        audioKaChing: 'Efecto Ka-ching',
        audioDescription: 'Sonar al marcar como pagado',
        dataManagement: 'Gestión de Datos',
        upgradeUnlockExport: 'Actualizar para Exportar',
        pro: 'PRO',
        exportDateRange: 'Filtro de Exportación',
        exportAllTime: 'Todo el Tiempo',
        exportThisYear: 'Este Año',
        exportLast3Months: 'Últimos 3 Meses',
        syncToGoogleDrive: 'Sincronizar con Drive',

        monthlyPass: 'Pase Mensual',
        mo: '/mes',
        yearlyPass: 'Pase Anual',
        yr: '/año',
        annualPass: 'Pase Anual',
        save20: 'Ahorra 20%',
        proFeatures: 'Funciones Pro',
        unlimitedRecurring: 'Tareas Recurrentes Ilimitadas',
        unlimitedTasks: 'Tareas recurrentes ilimitadas (Gratis limitado a 5)',
        proExportPDF: 'Exportación a PDF y CSV',
        advancedExport: 'Exportación avanzada a PDF y CSV',
        clientAnalytics: 'Análisis de Retraso',
        upgradeToPro: 'Actualizar a Pro',
        upgradeDesc: 'Desbloquea todo el potencial de PayTrail.',
        subscribe: 'Suscribirse',
        unlockPotential: 'Desbloquea todo el potencial de PayTrail.',
        googleDriveSync: 'Sincronizar con Google Drive',

        noTasks: 'No hay tareas para esta fecha.',
        noTasksScheduled: 'No hay tareas programadas para este día.',
        addTaskForDate: 'Agregar tarea para esta fecha',
        remind: 'Recordar',
        remindTemplate: 'Hola, este es un recordatorio amable sobre el pago atrasado. Por favor revíselo cuando pueda.',
        proRemindTemplate: 'Hola {company},\nEste es un recordatorio de que el pago originalmente programado para {dueDate} está retrasado. Por favor, revise su sistema.',
        freeRemindTemplate: 'Hola {company},\nPor favor, verifique el estado del pago para nuestro proyecto reciente.',
        systemGeneratedMessage: '[Este mensaje fue generado automáticamente por PayTrail]',
        remindMessageCopied: '¡Mensaje de recordatorio copiado al portapapeles!',
        markAsPaid: '¡Marcar como Pagado!',
        partial: 'Parcial',
        paid: 'Pagado',
        remaining: 'Restante',
        quickPay: 'Pago Rápido',

        newTask: 'Nueva Tarea',
        editTask: 'Editar Tarea',
        clientCompany: 'Cliente / Empresa *',
        contactOptional: 'Nombre del Contacto',
        amount: 'Monto *',
        calcGross: 'Bruto',
        calcNet: 'Neto',
        calcHint: 'El cálculo del 3.3% es automático.',
        receivedAmount: 'Monto Recibido',
        receivedHint: 'Pagos parciales',
        dueDate: 'Fecha límite de pago *',
        workDate: 'Fecha de Trabajo',
        workDateStart: 'Inicio del Trabajo / Conferencia',
        workDateEnd: 'Fin del Trabajo / Conferencia',
        workDateHint: 'Especifique la fecha(s) en las que realiza el trabajo.',
        memo: 'Memo (Detalles del contrato)',
        setRecurring: 'Hacer Recurrente',
        none: 'Ninguno',
        weekly: 'Semanal',
        monthly: 'Mensual',
        monthEnd: 'Fin de Mes',
        save: 'Guardar',
        deleteTask: 'Borrar Tarea',
        restoreDraft: 'Se restauró el borrador.',

        statusScheduled: 'Programado',
        statusWaiting: 'En Espera',
        statusOverdue: 'Atrasado',
        statusPaid: 'Pagado',
        undoPayment: 'Deshacer Pago',
        edit: 'Editar',
        delete: 'Eliminar',
        tasks: 'tareas',
        emptySummaryTasks: 'No hay tareas.',
    }
};

export function useTranslation() {
    const { userSettings } = useStore();
    const lang = userSettings.language || 'ko';

    return {
        t: (key: TranslationKeys) => translations[lang][key],
        lang
    };
}
