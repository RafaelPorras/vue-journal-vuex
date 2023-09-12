import { createStore } from 'vuex'
import { shallowMount } from "@vue/test-utils"
import journal from '@/modules/daybook/store/journal'
import { journalState } from '../../../mock-data/test-journal-state'
import EntryView from '@/modules/daybook/views/EntryView.vue'
import Swal from 'sweetalert2'



const createVuexStore = ( initialState ) => 
    createStore({
        modules:{
            journal:{
                ...journal,
                state: { ...initialState }
            }
        }
})

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
    showLoading: jest.fn(),
    close: jest.fn()
}))


describe('Pruebas en el EntryView', () => {
    const store = createVuexStore( journalState )
    store.dispatch = jest.fn() //evitamos que se ejecuten los dispatch con lo que impedimos que se borren los datos
    
    const mockRouter = {
        push: jest.fn()
    }

    let wrapper 

    //Reiniciamos el wrapper para cada prueba
    beforeEach( () => {
        jest.clearAllMocks()

        wrapper = shallowMount( EntryView, {
            props:{
                id: '-Nd_4agdcyRDK0G5x30F'
            },
            global:{
                mocks:{
                    $router: mockRouter,
                },
                plugins: [ store ]
            }
        })
    })



    test('debe de sacar al usuario porque el id no existe', () => {

       wrapper = shallowMount( EntryView, {
            props:{
                id: 'Este ID no existe en el store'
            },
            global:{
                mocks:{
                    $router: mockRouter,
                },
                plugins: [ store ],
            }
        })

        expect( mockRouter.push ).toHaveBeenCalledWith( {name: 'no-entry'} )

    })
    
    
    test('debe de mostrar la entrada correctamente', () => {
        expect( wrapper.html() ).toMatchSnapshot()
        expect( mockRouter.push ).not.toHaveBeenCalled()

    })

    test( 'debe de borrar la entrada y salida',  (done) => {


        Swal.fire.mockReturnValueOnce(  Promise.resolve( { isConfirmed: true}) )
        wrapper.find( '.btn-danger' ).trigger('click')

        expect( Swal.fire ).toHaveBeenCalledWith({
            title:'¿Are you sure?',
            text: 'You cannot undelete the changes',
            showDenyButton: true,
            confirmButtonText: 'Yes, I am sure '
        })

        setTimeout( () => {
            expect( store.dispatch ).toHaveBeenCalledWith("journal/deleteEntry", "-Nd_4agdcyRDK0G5x30F")
            expect( mockRouter.push ).toHaveBeenCalled()
            done()
        }, 1)
        

    })

})