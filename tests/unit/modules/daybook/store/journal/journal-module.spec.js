import { createStore } from "vuex"
import journal from '@/modules/daybook/store/journal'
import { journalState } from "../../../../mock-data/test-journal-state"




const createVuexStore = ( initialState ) => 
    createStore({
        modules:{
            journal:{
                ...journal,
                state: { ...initialState }
            }
        }
    })

describe('Vuex - Pruebas en el Journal Module', () => {

    //Basicas
    test('Este es el estado inicial, debe tener este state', () => {
        const store = createVuexStore( journalState )

        const { isLoading, entries} = store.state.journal

        expect( isLoading ).toBeFalsy()
        expect( entries ).toEqual( journalState.entries )
    })

    //Mutations
    test('mutations: setEntries', () => {
        const store = createVuexStore( {
            isLoading: true,
            entries: []
        })

        store.commit('journal/setEntries',journalState.entries)
        expect( store.state.journal.entries.length ).toBe(2)

        store.commit('journal/setEntries',journalState.entries)
        expect( store.state.journal.entries.length ).toBe(4)

        expect( store.state.journal.isLoading ).toBeFalsy()
    })

    test('mutations: updateEntry', () => {
        const store = createVuexStore( journalState )
        const entry = {
            id: "-Nd_-U3ecoohvKQAPTHj",
            date: 1693911733704,
            text: "Entrada desde mock data modificada"
        }

        store.commit('journal/updateEntry', entry)

        const entries = store.state.journal.entries

        expect( entries.length ).toBe(2)
        expect( entries.find( e => e.id === entry.id)).toEqual(entry)


    })

    test('mutations: addEntry deleteEntry', () => {
        const store = createVuexStore( journalState )
        const entry = {
            id: "1",
            date: 1693911733704,
            text: "Entrada desde mock data modificada"
        }

        store.commit('journal/addEntry', entry)

        let entries = store.state.journal.entries
        expect( entries.length ).toBe(3)
        expect( entries.find(e => e.id === entry.id)).toEqual(entry)

        store.commit('journal/deleteEntry',entry.id)
        entries = store.state.journal.entries
        expect( entries.length ).toBe(2)
        expect( entries.find(e => e.id === entry.id)).toBeFalsy()
     
    })

    //GETTERS
    test('getters: getEntriesByTerm, getEntryById', () => {
        const store = createVuexStore( journalState )
        const [entry1, entry2] = journalState.entries

        expect( store.getters['journal/getEntriesByTerm']('').length ).toBe(2)
        expect( store.getters['journal/getEntriesByTerm']('dos').length ).toBe(1)

        expect( store.getters['journal/getEntriesByTerm']('dos') ).toEqual([ entry2 ])
        expect( store.getters['journal/getEntryById']('-Nd_-U3ecoohvKQAPTHj') ).toEqual(entry1)
        
    })

    //ACTIONS
    test('accions: loadEntries', async () => {
        const store = createVuexStore( {
            isLoading: true,
            entries: []
        })

        await store.dispatch('journal/loadEntries')

        expect(store.state.journal.entries.length).toBe(3)
    })

    test('actions: updateEntry', async () => {
        const store = createVuexStore( journalState )
        const entry = {
            id: "-Nd_-U3ecoohvKQAPTHj",
            date: 1693911733704,
            text: "Entrada desde mock data modificada"
        }

        await store.dispatch('journal/updateEntry',entry)

        let entries = store.state.journal.entries

        expect( entries.length ).toBe(2)
        expect( entries.find( e => e.id === entry.id) ).toEqual( entry )
    })

    test('action: createEntry, deleteEntry', async () => {
        const store = createVuexStore( journalState )
        const newEntry = {date: 1627077227978, 
                          text: 'Nueva entrada'}

        const id = await store.dispatch('journal/createEntry', newEntry)
        expect(typeof id).toBe('string')

        const entries = store.state.journal.entries
        expect( entries.find( e => e.id === id)).toBeTruthy()

        const entry = await store.dispatch('journal/deleteEntry', id)
        expect( entries.find( e => e.id === entry.id)).toBeFalsy()
        
    })
})