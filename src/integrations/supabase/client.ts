// Temporary mock Supabase client to prevent build errors
// This will be replaced with the real Supabase client once the database is set up

const createQueryBuilder = (): any => ({
  select: (columns?: string) => createQueryBuilder(),
  eq: (column: string, value: any) => createQueryBuilder(),
  single: async () => ({ data: null, error: new Error('Database setup required') }),
  order: (column: string, options?: any) => ({ data: [], error: new Error('Database setup required') }),
  insert: (data: any) => createQueryBuilder(),
  update: (data: any) => createQueryBuilder(),
  delete: () => ({ error: new Error('Database setup required') }),
  data: [],
  error: new Error('Database setup required')
});

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async (credentials: any) => ({ 
      data: { user: null }, 
      error: new Error('Please run the database setup SQL first') 
    }),
    signUp: async (credentials: any) => ({ 
      data: { user: null }, 
      error: new Error('Please run the database setup SQL first') 
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: (tableName: string) => createQueryBuilder()
};