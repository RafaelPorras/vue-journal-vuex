<template>
    <template v-if="entry" >
        <div class="entry-title d-flex justify-content-between p-2">
            <div>
                <span class="text-success fs-3 fw-bold"> {{ day }}</span>
                <span class="mx-1 fs-3"> {{ month }}</span>
                <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
            </div>

            <div> 
                <input type="file" 
                        ref="imageSelector"
                        v-show="false"
                        accept="image/png, image/jpeg"
                        @change="onSelectedImage">   

                <button 
                    v-if="entry.id" 
                    class="btn btn-danger mx-2" 
                    @click="onDeleteEntry">
                        Delete
                    <i class="fa fa-trash-alt"></i>
                </button>

                <button class="btn btn-primary"
                        @click="onSelectImage">
                    Upload photo
                    <i class="fa fa-upload"></i>
                </button>

            </div>
        </div>

        <hr>

        <div class="d-flex flex-column px-3 h-75">
            <textarea v-model="entry.text" 
                placeholder="¿Qué sucedió hoy?" >
            </textarea>
        </div>

        <img 
            v-if="entry.picture && !localImage"
            :src='entry.picture' 
            alt="sky" 
            class="img-thumbnail"> 

        <img
            v-if="localImage" 
            :src='localImage' 
            alt="sky" 
            class="img-thumbnail">
    </template>

    <Fab icon="fa-upload" @on:click="saveEntry"/>

 
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import getDayMonthYear from '../helpers/getDayMonthYear'
import Swal from 'sweetalert2'
import uploadImage from '../helpers/uploadImage'

export  default{
    name: 'EntryView',
    props:{
        id:{
            type: String,
            required: true
        }
    },
    components:{
        Fab: defineAsyncComponent( () => import('../components/FabButton.vue'))
    },

    data(){
        return{
            entry: null,
            localImage: null,
            file: null
        }
    },


    created(){
       this.loadEntry()
    },

    watch:{
        id(){
            this.loadEntry()
        }
    },

    computed:{
        ...mapGetters('journal',['getEntryById']),
       
        day(){
            const { day } = getDayMonthYear(this.entry.date)

            return day
        },
        month(){
            const { month } = getDayMonthYear(this.entry.date)
            return month
        },
        yearDay(){
            const { yearDay } = getDayMonthYear(this.entry.date)

            return yearDay
        }
    },
    methods:{   
        ...mapActions('journal',['updateEntry','createEntry','deleteEntry']),
        
        loadEntry(){
            let entry;

            if(this.id === 'new'){
                entry= {
                    text: '',
                    date: new Date().getTime()
                }
            }
            else
            {
                entry = this.getEntryById(this.id)     
                if( !entry ) return this.$router.push({name: 'no-entry'})
            }


            this.entry = entry;
        },
        
        async saveEntry(){
            Swal.fire({
                title:'Espera por favor',
                allowOutsideClick: false
            })

            Swal.showLoading()

            const picture = await uploadImage( this.file )

            this.entry.picture = picture

            if( this.entry.id){
                //actualizar
                await this.updateEntry(this.entry)
            }
            else
            {
               //crear
               const id = await this.createEntry(this.entry) 

                this.$router.push({name:'entry',params:{id}})
            }

            this.file = null

            Swal.fire('Guardado','Entrada registrada con exito','success')


         
        },

        async onDeleteEntry(){
            const { isConfirmed } = await Swal.fire({
                title:'¿Are you sure?',
                text: 'You cannot undelete the changes',
                showDenyButton: true,
                confirmButtonText: 'Yes, I am sure '
            })

            if(isConfirmed){
                Swal.fire({
                    title: 'Wait please',
                    allowOutsideClick: false
                });

                Swal.showLoading()

                await this.deleteEntry(this.entry.id)
                this.$router.push({name:'no-entry'})

                Swal.fire('Deleted','','success')
            }
        },

        onSelectedImage( event ){
            const file = event.target.files[0]

            if(!file){
                this.localImage = null
                this.file = null
                return 
            } 

            this.file = file

            const fr = new FileReader()
            fr.onload = () => this.localImage = fr.result 
            fr.readAsDataURL( file )

        },

        onSelectImage(){
           this.$refs.imageSelector.click()
        }
    }
}

</script>

<style lang="scss" scoped>
textarea{
    font-size: 20px;
    border: none;
    height: 100%;

    &:focus{
        outline: none;
    }
}

img{
    width: 200px;
    position: fixed;
    bottom: 150px;
    right: 20px;
    box-shadow: 0px 5px 10px rgba(#000,$alpha: 0.2);
}

</style>