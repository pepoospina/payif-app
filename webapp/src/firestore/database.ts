import { initializeApp } from 'firebase/app'
import {
  collection,
  collectionGroup,
  connectFirestoreEmulator,
  doc,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

import { CollectionNames } from '../shared/collectionNames'

const firebaseConfig = {
  apiKey: 'AIzaSyD0Mg8hk5cQAfNc-ZNM-pM_76kZY4IXxM4',
  authDomain: 'microrevolutions-a6bcf.firebaseapp.com',
  projectId: 'microrevolutions-a6bcf',
  storageBucket: 'microrevolutions-a6bcf.appspot.com',
  messagingSenderId: '960631524467',
  appId: '1:960631524467:web:a50a27aeaaa3c5990eee06',
}

export const app = initializeApp(firebaseConfig)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

const isProd =
  process.env.NODE_ENV === 'production' || (process as any).env.NODE_ENV === 'test-prod'

if (!isProd) {
  console.log('RUNNING ON DEVELOPMENT NODE - CONNECTING TO LOCALSTORE FIRESTORE')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

export const collections = {
  tree: (root: string) => doc(db, CollectionNames.Trees, root),
  project: (id: number) => doc(db, CollectionNames.Projects, id.toString()),
  identity: (id: string) => doc(db, CollectionNames.Identities, id),
  projectInvites: (projectId: number) => {
    const project = doc(db, CollectionNames.Projects, projectId.toString())
    return collection(project, CollectionNames.ProjectInvitations)
  },
  memberApplications: (projectId: number) => {
    const project = doc(db, CollectionNames.Projects, projectId.toString())
    return collection(project, CollectionNames.Applications)
  },
  entities: collection(db, CollectionNames.Entities),
  members: collectionGroup(db, CollectionNames.ProjectMembers),
  projectMembers: (projectId: number) => {
    const project = doc(db, CollectionNames.Projects, projectId.toString())
    return collection(project, CollectionNames.ProjectMembers)
  },
  identities: collection(db, CollectionNames.Projects),
  projects: collection(db, CollectionNames.Projects),
  users: collection(db, CollectionNames.Users),
  statements: collection(db, CollectionNames.Statements),
  statement: (statementId: string) => doc(db, CollectionNames.Statements, statementId),
  statementsBackers: (statementId: string) => {
    const statement = doc(db, CollectionNames.Statements, statementId)
    return collection(statement, CollectionNames.StatementsBackers)
  },
}
