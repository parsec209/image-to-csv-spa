<template>
  <div>       
    <p><strong>String search methods</strong></p>
    <b-form-group v-slot="{ searchOrInputMethods }">
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="leftPhrase"
      >
        Anchor phrase - horizontal search
        <b-badge variant="secondary" href="#" id="leftPhrase-tip">
          <b-icon icon="question-circle-fill" aria-label="leftPhrase-tip"></b-icon>
        </b-badge>
        <b-popover target="leftPhrase-tip" triggers="hover focus">
          <InstructionsAnchorPhraseHorizontal />        
        </b-popover>
      </b-form-radio>
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="topPhrase"
      >
        Anchor phrase - vertical search
        <b-badge variant="secondary" href="#" id="topPhrase-tip">
          <b-icon icon="question-circle-fill" aria-label="topPhrase-tip"></b-icon>
        </b-badge>
        <b-popover target="topPhrase-tip" triggers="hover focus">
          <InstructionsAnchorPhraseVertical />        
        </b-popover>
      </b-form-radio>                              
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="pattern" 
        @input="resetCellSect"
      >
        Regular expression
        <b-badge variant="secondary" href="#" id="textPattern-tip">
          <b-icon icon="question-circle-fill" aria-label="textPattern-tip"></b-icon>
        </b-badge>
        <b-popover target="textPattern-tip" triggers="hover focus">
          <InstructionsRegularExpression />        
        </b-popover>
      </b-form-radio>
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="customValue"
      >
        Custom value
        <b-badge variant="secondary" href="#" id="customValue-tip">
          <b-icon icon="question-circle-fill" aria-label="customValue-tip"></b-icon>
        </b-badge>
        <b-popover target="customValue-tip" triggers="hover focus">
          <InstructionsCustomValue />
        </b-popover>
      </b-form-radio>           
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="today" 
        @input="resetCellSect"
      >
        Today's date
        <b-badge variant="secondary" href="#" id="today-tip">
          <b-icon icon="question-circle-fill" aria-label="today-tip"></b-icon>
        </b-badge>
        <b-popover target="today-tip" triggers="hover focus">
          <InstructionsTodayDate />
        </b-popover>
      </b-form-radio>                                      
      <b-form-radio 
        v-model="updatedSect.searchOrInputMethod.$model" 
        :aria-describedby="searchOrInputMethods" 
        value="" 
        @input="resetCellSect"
      >
        Empty cell
        <b-badge variant="secondary" href="#" id="emptyCell-tip">
          <b-icon icon="question-circle-fill" aria-label="emptyCell-tip"></b-icon>
        </b-badge>
        <b-popover target="emptyCell-tip" triggers="hover focus">
          <InstructionsEmptySection />
        </b-popover>
      </b-form-radio>                                            
    </b-form-group>                   
    <br>
    <label for="phraseOrValue-input">
      <strong>Search string </strong>
      <b-badge variant="secondary" href="#" id="phraseOrValue-tip">
        <b-icon icon="question-circle-fill" aria-label="phraseOrValue-tip"></b-icon>
      </b-badge>
      <b-popover target="phraseOrValue-tip" triggers="hover focus">
        <InstructionsSearchString />
      </b-popover>
    </label>             
    <b-form-group>
      <b-form-input 
        id="phraseOrValue-input"
        placeholder="Enter anchor phrase, regex, or custom value" 
        v-model="updatedSect.phraseOrValue.$model" 
        :state="$validateState(updatedSect.phraseOrValue)" 
        aria-describedby="phraseOrValue-live-feedback"
        :disabled="!updatedSect.searchOrInputMethod.$model || updatedSect.searchOrInputMethod.$model === 'today'"
      >
      </b-form-input>
      <b-form-invalid-feedback id="phraseOrValue-live-feedback">
        Please enter phrase or value
      </b-form-invalid-feedback>
    </b-form-group>
    <br>             
    <p>
      <strong>String retrieval type </strong>
      <b-badge variant="secondary" href="#" id="stringRetrievalType-tip">
        <b-icon icon="question-circle-fill" aria-label="stringRetrievalType-tip"></b-icon>
      </b-badge>
      <b-popover target="stringRetrievalType-tip" triggers="hover focus">
        <InstructionsStringRetrievalType />
      </b-popover>
    </p>             
    <b-form-group v-slot="{ stringTypes }">
      <b-form-radio 
        v-model="updatedSect.stringType.$model" 
        :aria-describedby="stringTypes" 
        value="phrase" 
        :disabled="!updatedSect.searchOrInputMethod.$model || 
          updatedSect.searchOrInputMethod.$model === 'today' || 
          updatedSect.searchOrInputMethod.$model === 'customValue' || 
          updatedSect.searchOrInputMethod.$model === 'pattern'"
      >
        Phrase
      </b-form-radio>
      <b-form-radio 
        v-model="updatedSect.stringType.$model" 
        :aria-describedby="stringTypes" value="word" 
        :disabled="!updatedSect.searchOrInputMethod.$model || 
          updatedSect.searchOrInputMethod.$model === 'today' || 
          updatedSect.searchOrInputMethod.$model === 'customValue' || 
          updatedSect.searchOrInputMethod.$model === 'pattern'"
      >
        Word
      </b-form-radio>                                                                     
    </b-form-group>   
    <br>
    <div>
      <label for="sb-inline-phraseCount">
        <strong> String count (1-100) </strong>
        <b-badge variant="secondary" href="#" id="addPhraseCount-tip">
          <b-icon icon="question-circle-fill" aria-label="addPhraseCount-tip"></b-icon>
        </b-badge>
        <b-popover target="addPhraseCount-tip" triggers="hover focus">
          <InstructionsStringCount />
        </b-popover>
      </label>
      <br>
      <b-form-spinbutton 
        id="sb-inline-phraseCount" 
        min="1" 
        max="100" 
        step="1" 
        v-model="updatedSect.phraseCount.$model" 
        inline
        :disabled="!updatedSect.searchOrInputMethod.$model || 
          updatedSect.searchOrInputMethod.$model === 'today' || 
          updatedSect.searchOrInputMethod.$model === 'customValue'"
      >
      </b-form-spinbutton>
    </div>
    <br>
    <br>
    <label for="appendChars-input">
      (Optional)<strong> Append characters </strong>
      <b-badge variant="secondary" href="#" id="appendChars-tip">
        <b-icon icon="question-circle-fill" aria-label="appendChars-tip"></b-icon>
      </b-badge>
      <b-popover target="appendChars-tip" triggers="hover focus">
        <InstructionsAppendChars />
      </b-popover>
    </label>             
    <b-form-group>
      <b-form-input 
        id="appendChars-input"
        placeholder="Enter characters, including spaces" 
        v-model="updatedSect.appendChars.$model" 
        :state="$validateState(updatedSect.appendChars)" 
        :disabled="!updatedSect.searchOrInputMethod.$model"
      >
      </b-form-input>
      <pre :class="{ appendedChars: updatedSect.appendChars.$model }">
        Appended characters: "{{ updatedSect.appendChars.$model }}"
      </pre> 
    </b-form-group>
    <br>
    <label for="formatDate-input">
      (Optional)<strong> Format date </strong>
      <b-badge variant="secondary" href="#" id="formatDate-tip">
        <b-icon icon="question-circle-fill" aria-label="formatDate-tip"></b-icon>
      </b-badge>
      <b-popover target="formatDate-tip" triggers="hover focus">
        <InstructionsFormatDate />
      </b-popover>
    </label>             
    <b-form-group>
      <b-form-input 
        id="formatDate-input"
        placeholder="M D Y - , / and spaces allowed"
        v-model="updatedSect.dateFormat.$model" 
        :state="$validateState(updatedSect.dateFormat)" 
        aria-describedby="dateFormat-live-feedback"
        :disabled="!updatedSect.searchOrInputMethod.$model"
      >
      </b-form-input>
      <b-form-invalid-feedback id="dateFormat-live-feedback">
        Invalid date format
      </b-form-invalid-feedback>
    </b-form-group>
    <br>
    <div>
      <label for="sb-inline-daysAdded">
        (Optional)<strong> Add days to date (0-100) </strong>
        <b-badge variant="secondary" href="#" id="addDays-tip">
          <b-icon icon="question-circle-fill" aria-label="addDays-tip"></b-icon>
        </b-badge>
        <b-popover target="addDays-tip" triggers="hover focus">
          <InstructionsAddDays />
        </b-popover>
      </label>
      <br>
      <b-form-spinbutton 
        id="sb-inline-daysAdded" 
        min="0" 
        max="100" 
        step="1" 
        v-model="updatedSect.daysAdded.$model" 
        inline
        :disabled="!updatedSect.searchOrInputMethod.$model"
      >
      </b-form-spinbutton>
      <br>
      <br>
      <br>
      <b-form-textarea
        v-model="updatedSect.notes.$model"
        placeholder="Enter notes..."
        rows="2"
        max-rows="6"
        :disabled="!updatedSect.searchOrInputMethod.$model"
      >
      </b-form-textarea>
    </div>
  </div>
</template>


<script>
import InstructionsAnchorPhraseHorizontal from './InstructionsAnchorPhraseHorizontal'
import InstructionsAnchorPhraseVertical from './InstructionsAnchorPhraseVertical'
import InstructionsRegularExpression from './InstructionsRegularExpression'
import InstructionsCustomValue from './InstructionsCustomValue'
import InstructionsTodayDate from './InstructionsTodayDate'
import InstructionsEmptySection from './InstructionsEmptySection'
import InstructionsSearchString from './InstructionsSearchString'
import InstructionsStringRetrievalType from './InstructionsStringRetrievalType'
import InstructionsStringCount from './InstructionsStringCount'
import InstructionsAppendChars from './InstructionsAppendChars'
import InstructionsFormatDate from './InstructionsFormatDate'
import InstructionsAddDays from './InstructionsAddDays'

export default {
  name: 'RecurringDocTableBodyDataCell',
  components: {
    InstructionsAnchorPhraseHorizontal,
    InstructionsAnchorPhraseVertical,
    InstructionsRegularExpression,
    InstructionsCustomValue,
    InstructionsTodayDate,
    InstructionsEmptySection,
    InstructionsSearchString,
    InstructionsStringRetrievalType,
    InstructionsStringCount,
    InstructionsAppendChars,
    InstructionsFormatDate,
    InstructionsAddDays
  },
  props: {
    cellSect: Object,
  },
  data() {
    return {
      updatedSect: this.cellSect
    }
  },
  methods: {     
    resetCellSect() {
      if (this.updatedSect.searchOrInputMethod.$model !== 'topPhrase' && this.updatedSect.searchOrInputMethod.$model !== 'leftPhrase') { 
        this.updatedSect.stringType.$model = 'phrase'
      }
      if (!this.updatedSect.searchOrInputMethod.$model || this.updatedSect.searchOrInputMethod.$model === 'today' || this.updatedSect.searchOrInputMethod.$model === 'customValue') {
        this.updatedSect.phraseCount.$model = 1
      }
      if (!this.updatedSect.searchOrInputMethod.$model || this.updatedSect.searchOrInputMethod.$model === 'today') { 
        this.updatedSect.phraseOrValue.$model = ''
      }
      if (this.updatedSect.searchOrInputMethod.$model === 'today') { 
        this.updatedSect.phraseOrValue.$reset()
      }
      if (!this.updatedSect.searchOrInputMethod.$model) { 
        this.updatedSect.appendChars.$model = ''
        this.updatedSect.dateFormat.$model = ''
        this.updatedSect.daysAdded.$model = 0
        this.updatedSect.notes.$model = ''
        this.updatedSect.$reset()   
      }
    }
  }
}
</script>


<style scoped>
.appendedChars {
  color: green;
}
</style>