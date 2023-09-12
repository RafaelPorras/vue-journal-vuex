
import { createStore } from 'vuex'
import { shallowMount } from "@vue/test-utils"

import EntryList from "@/modules/daybook/components/EntryList.vue"
import journal from '@/modules/daybook/store/journal'
import { journalState } from '../../../mock-data/test-journal-state' 


const createVuexStore = ( initialState ) => 
    createStore({
        modules:{
            journal:{
                ...journal,
                state: { ...initialState }
            }
        }
})

describe('Pruebas en el EntryList', () => {
    const store = createVuexStore( journalState )
    
    const mockRouter = {
        push: jest.fn()
    }

    let wrapper 

    //Reiniciamos el wrapper para cada prueba
    beforeEach( () => {
        jest.clearAllMocks()

        wrapper = shallowMount( EntryList, {
            global:{
                mocks:{
                    $router: mockRouter,
                },
                plugins: [ store ]
            }
        })
    })

    test('debe de llamar el getEntriesByTerm sin termino y mostrar 2 entradas', () => {

        expect( wrapper.findAll( 'entry-stub' ).length ).toBe(2)
        expect( wrapper.html() ).toMatchSnapshot()
    })

    test('debe llamar el getEntriesByTerm y filtrar las entradas', async () => {
        const input = wrapper.find( 'input' )
        await input.setValue('dos')

        expect( wrapper.findAll( 'entry-stub' ).length ).toBe(1)
    })

    test( 'el boton de nuevo debe redireccionar a /new' , () => {
        wrapper.find( 'button' ).trigger('click')
        expect( mockRouter.push ).toHaveBeenCalledWith({name:'entry',params:{id: 'new'}})
    })

})



 
// De esta forma tenemos control sobre las store pero es mas farragoso  
// describe('Pruebas en el EntryList', () => {

    

//     const journalMockModule = {
//         namespaced: true,
//         getters:{
//             //getEntriesByTerm: jest.fn()
//             getEntriesByTerm
//         },
//         state: () => ({
//             isLoading: false,
//             entries: journalState.entries
//         })
//     }

//     const store = createStore({
//         modules:{
//             journal: { ...journalMockModule }
//         }
//     })

//     const createVuexStore = ( initialState ) => 
//     createStore({
//         modules:{
//             journal:{
//                 ...journal,
//                 state: { ...initialState }
//             }
//         }
//     })

//     const wrapper = shallowMount( EntryList, {
//         global:{
//             mocks:{
//                 //$router:
//             },
//             plugins: [ store ]        
//         }
//     } )


//     test('debe de llamar el getEntriesByTerm sin termino y mostrar 2 entradas', () => {

//         console.log( wrapper.html() )
//     })

// })