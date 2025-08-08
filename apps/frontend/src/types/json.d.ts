/**
 * Type declarations for JSON module imports
 * This allows TypeScript to understand JSON imports
 */

declare module "*.json" {
  const value: Record<string, any>;
  export default value;
}

// Specific type declarations for translation files
declare module "*/locales/*/common.json" {
  const value: {
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    yes: string;
    no: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    reload: string;
    close: string;
    open: string;
    view: string;
    download: string;
    upload: string;
    copy: string;
    paste: string;
    cut: string;
    select: string;
    selectAll: string;
    clear: string;
    reset: string;
    submit: string;
    login: string;
    logout: string;
    register: string;
    profile: string;
    settings: string;
    help: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    notFound: string;
    pageNotFound: string;
    serverError: string;
    networkError: string;
    unknownError: string;
    tryAgain: string;
    goHome: string;
    language: string;
    theme: string;
    lightMode: string;
    darkMode: string;
    systemMode: string;
  };
  export default value;
}

declare module "*/locales/*/navigation.json" {
  const value: {
    home: string;
    users: string;
    about: string;
    contact: string;
    menu: string;
    navigation: string;
    breadcrumb: {
      home: string;
      users: string;
      userDetail: string;
    };
    sidebar: {
      dashboard: string;
      users: string;
      settings: string;
      logout: string;
    };
    footer: {
      copyright: string;
      privacyPolicy: string;
      termsOfService: string;
      contactUs: string;
    };
  };
  export default value;
}

declare module "*/locales/*/home.json" {
  const value: {
    title: string;
    subtitle: string;
    description: string;
    features: {
      title: string;
      pwa: {
        title: string;
        description: string;
      };
      offline: {
        title: string;
        description: string;
      };
      responsive: {
        title: string;
        description: string;
      };
      performance: {
        title: string;
        description: string;
      };
    };
    cta: {
      getStarted: string;
      learnMore: string;
      viewUsers: string;
      installApp: string;
    };
    stats: {
      users: string;
      downloads: string;
      rating: string;
      countries: string;
    };
  };
  export default value;
}

declare module "*/locales/*/users.json" {
  const value: {
    title: string;
    subtitle: string;
    list: {
      title: string;
      empty: string;
      loading: string;
      error: string;
      search: string;
      filter: string;
      sort: {
        name: string;
        email: string;
        date: string;
      };
    };
    detail: {
      title: string;
      loading: string;
      error: string;
      notFound: string;
      backToList: string;
    };
    form: {
      name: string;
      email: string;
      phone: string;
      website: string;
      company: string;
      address: string;
      save: string;
      cancel: string;
      required: string;
      invalidEmail: string;
    };
    actions: {
      view: string;
      edit: string;
      delete: string;
      add: string;
      export: string;
      import: string;
    };
    pagination: {
      showing: string;
      page: string;
      itemsPerPage: string;
    };
  };
  export default value;
}
