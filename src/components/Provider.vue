<script setup>
import { computed } from 'vue';
import App from '../App.vue'
import { darkTheme, lightTheme  } from 'naive-ui'

const uzUz = {
  name: "uz-UZ",
  global: {
    undo: "Бекор қилиш",
    redo: "Қайта қилинг",
    confirm: "Тасдиқлаш",
  },
  Popconfirm: {
    positiveText: "Тасдиқлаш",
    negativeText: "Бекор қилиш",
  },
  Cascader: {
    placeholder: "Илтимос танланг",
    loading: "Юкланмоқда",
    loadingRequiredMessage: (label) =>
      `Белгилашдан олдин ${label} нинг барча ички элементларини танланг.`,
  },
  Time: {
    dateFormat: "DD.MM.YYYY",
    dateTimeFormat: "DD.MM.YYYY HH:MM:SS",
  },
  DatePicker: {
    yearFormat: "yyyy",
    monthFormat: "MM",
    dayFormat: "eeeeee",
    yearTypeFormat: "yyyy",
    monthTypeFormat: "yyyy-MM",
    dateFormat: "yyyy-MM-dd",
    dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
    quarterFormat: "yyyy-qqq",
    clear: "Тозалаш",
    now: "Ҳозир",
    confirm: "Тасдиқлаш",
    selectTime: "Вақтни танланг",
    selectDate: "Санани танланг",
    datePlaceholder: "Санани танланг",
    datetimePlaceholder: "Сана ва Вақтни танланг",
    monthPlaceholder: "Ойни танланг",
    yearPlaceholder: "Йилни танланг",
    quarterPlaceholder: "Чоракни танланг",
    startDatePlaceholder: "Бошланиш Санаси",
    endDatePlaceholder: "Тугаш Санаси",
    startDatetimePlaceholder: "Бошланиш Санаси ва Вақти",
    endDatetimePlaceholder: "Тугаш Санаси ва Вақти",
    monthBeforeYear: true,
    firstDayOfWeek: 6,
    today: "Бугун",
  },
  DataTable: {
    checkTableAll: "Жадвалдаги барчасини танлаш",
    uncheckTableAll: "Жадвалдаги барча танловни олиб ташлаш",
    confirm: "Тасдиқлаш",
    clear: "Тозалаш",
  },
  Transfer: {
    sourceTitle: "Manba",
    targetTitle: "Maqsad",
  },
  Empty: {
    description: "Маълумот йўқ",
  },
  Select: {
    placeholder: "Илтимос танланг",
  },
  TimePicker: {
    placeholder: "Вақтни танланг",
    positiveText: "Xa",
    negativeText: "Бекор қилиш",
    now: "Ҳозир",
  },
  Pagination: {
    goto: "Ўтиш",
    selectionSuffix: "Саҳифа",
  },
  DynamicTags: {
    add: "қўшиш",
  },
  Log: {
    loading: "Юкланмоқда",
  },
  Input: {
    placeholder: "Илтимос, киритинг",
  },
  InputNumber: {
    placeholder: "Илтимос, киритинг",
  },
  DynamicInput: {
    create: "Yaratmoq",
  },
  ThemeEditor: {
    title: "Mavzu muharriri",
    clearAllваrs: "Barcha o'zgaruvchilarni tozalash",
    clearSearch: "Qidiruvni tozalash",
    filterCompName: "Filtr komponenti Номи",
    filterваrName: "Filter ваriable Name",
    import: "Import",
    export: "Export",
    restore: "Reset to Default",
  },
  
  // TODO: translation
  Image: {
    tipPrevious: "Олдинги расм (←)",
    tipNext: "Кейинги расм (→)",
    tipCounterclockwise: "Соат милига тескари",
    tipClockwise: "Соат ёналиши бўйича",
    tipZoomOut: "Кичрайтириш",
    tipZoomIn: "Катталаштириш",
    tipClose: "Бекор қилиш (Esc)",
  },
};

const themeOverrides = {
    common: {
      primaryColor: '#0073fa',
      primaryColorHover: '#0073fa',
      primaryColorPressed: '#0073fa',
      primaryColorSuppl: '#0073fa',
      textColor2: '#000',
      borderRadius: '7px',
      modalColor: '#eee',
      fontWeight: '700',
      fontSize: '16px',
      lineHeight: '20px',
      textColorDisabled: '#000'
    },
    Button: {
      // textColor: '#0922e3',
    },
    Collapse: {

    },
    Select: {
      peers: {
        InternalSelection: { 
        // textColor1: '#e57272',
        //   textColor: '#0922e3'
        }
      }
    }
    // ...
  }
</script>
<template>
<n-config-provider :theme="lightTheme" :locale="uzUz" :theme-overrides="themeOverrides">
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
        <n-loading-bar-provider>
            <App />
        </n-loading-bar-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</n-config-provider>
</template>