<template>
  <div class="em-editor">
    <div class="em-editor__editor">
      <div ref="codeEditor"></div>
    </div>
    <div class="panel-info">
      <em-spots :size="10"></em-spots>
      <div class="wrapper">
        <h2>{{isEdit ? $t('p.detail.editor.title[0]') : $t('p.detail.editor.title[1]')}}</h2>
        <div class="em-editor__form">
          <Form label-position="top">
              <!--<Form-item label="Method">-->
                <!--<i-select v-model="temp.method">-->
                  <!--<Option v-for="item in methods" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</i-select>-->
              <!--</Form-item>-->
              <Form-item>
                <div class="input-wrapper">
                  <div @click="showDesc = !showDesc" style="cursor: pointer;">
                    <Icon :type="showDesc?'arrow-down-b':'arrow-right-b'" style="cusor:pointer"></Icon>
                  </div>
                  <div class="label-wrapper" v-show="!showOperationIdInput">
                    <label style="padding: 0 8px; cursor: pointer;" @click="showDesc = !showDesc">{{temp.operationId}}</label>
                    <div class="input-edit-icon" @click="focusOperationIdInput()">
                      <Icon type="edit"></Icon>
                    </div>
                  </div>
                  <div width="300px" style="display: inline-block;" v-show="showOperationIdInput">
                    <Input ref="operationIdInput" v-model="temp.operationId" size="small" @on-blur="showOperationIdInput=false" @on-enter="showOperationIdInput=false"/>
                  </div>
                </div>
                <Input v-show="showDesc" v-model="temp.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 90%"></Input>
              </Form-item>
              <Form-item :label="$t('p.detail.columns[2]')">
                <Row :gutter="16">
                  <Col span="20">
                    <i-input v-model="temp.url" placeholder="Enter request URL" size="large">
                      <i-select v-model="temp.method" slot="prepend" style="width: 80px">
                        <i-option v-for="item in methods" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                      </i-select>
                      <i-button slot="append" @click="params = !params">Params</i-button>
                    </i-input>
                  </Col>
                  <Col span="2">
                    <Button type="primary" long @click="submit" size="large" style="min-width: 60px;">{{isEdit ? $t('p.detail.editor.action[0]') : $t('p.detail.editor.action[1]')}}</Button>
                  </Col>
                  <Col span="2">
                    <Button type="ghost" long @click="close" size="large" style="min-width: 60px;">{{$t('p.detail.editor.control[2]')}}</Button>
                  </Col>
                </Row>
            </Form-item>
              <FormItem v-show="params">
                <div class="ivu-table-wrapper">
                  <div class="ivu-table ivu-table-small ivu-table-border">
                    <div class="ivu-table-header">
                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                        <colgroup>
                          <col width="289" />
                          <col width="80" />
                          <col width="80" />
                          <col width="290" />
                          <col width="290" />
                          <col width="30" />
                        </colgroup>
                        <thead>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Key</span>
                            </div></th>
                          <th class="ivu-table-column-center">
                          <div class="">
                            <span>Required</span>
                          </div></th>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Type</span>
                            </div></th>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Default</span>
                            </div></th>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Description</span>
                            </div></th>
                          <th class="ivu-table-column-center">
                            <div class="ivu-table-cell">
                              <span> </span>
                            </div></th>
                        </tr>
                        </thead>
                      </table>
                    </div>
                    <div class="ivu-table-body">
                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                        <colgroup>
                          <col width="289" />
                          <col width="80" />
                          <col width="80" />
                          <col width="290" />
                          <col width="290" />
                          <col width="30" />
                        </colgroup>
                        <tbody class="ivu-table-tbody">
                        <tr class="ivu-table-row" v-for="(item, index) in sortParameters">
                          <td class="">
                            <div class="ivu-table-cell">
                              <div class="ivu-input-wrapper ivu-input-type">
                                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <input autocomplete="off" spellcheck="false" type="text" :placeholder="placeholder(item, 'New Key')" v-model="item.name" class="ivu-input" v-on:input="addRow(item, 'name', $event)" :disabled="item.in === 'path'"/>
                              </div>
                            </div></td>
                          <td class="ivu-table-column-center">
                            <div class="ivu-table-cell">
                              <div class="ivu-input-wrapper ivu-input-type">
                                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <i-switch v-model="item.required" :disabled="item.in === 'path'">
                                  <Icon type="android-done" slot="open"></Icon>
                                  <Icon type="android-close" slot="close"></Icon>
                                </i-switch>
                              </div>
                            </div></td>
                          <td class="">
                            <div class="ivu-table-cell">
                              <div class="ivu-input-wrapper ivu-input-type">
                                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <input autocomplete="off" spellcheck="false" type="text" :placeholder="placeholder(item, 'Type')" v-model="item.schema.type" class="ivu-input"  v-on:input="addRow(item, 'type', $event)"/>
                              </div>
                            </div></td>
                          <td class="">
                            <div class="ivu-table-cell">
                              <div>
                                <div class="ivu-input-wrapper ivu-input-type">
                                  <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                  <input autocomplete="off" spellcheck="false" type="text" :placeholder="placeholder(item, 'Default Value')" v-model="item.schema.default" class="ivu-input"  v-on:input="addRow(item, 'default', $event)" :disabled="item.in === 'path'"/>
                                </div>
                              </div>
                            </div></td>
                          <td class="">
                            <div class="ivu-table-cell">
                              <div>
                                <div class="ivu-input-wrapper ivu-input-type">
                                  <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                  <input autocomplete="off" spellcheck="false" type="text" :placeholder="placeholder(item, 'Description')" maxlength="30" v-model="item.description" class="ivu-input"  v-on:input="addRow(item, 'description', $event)"/>
                                </div>
                              </div>
                            </div></td>
                          <td class="ivu-table-column-center">
                            <div class="ivu-table-cell">
                              <button type="button" class="ivu-btn ivu-btn-error ivu-btn-small" @click="remove(index)" v-show="showRemove(item)">
                                <span>x</span></button>
                            </div></td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </FormItem>
            <Form-item :label="$t('p.detail.editor.autoClose')" v-if="isEdit">
              <i-switch v-model="autoClose"></i-switch>
            </Form-item>
          </Form>
        </div>
        <div class="em-editor__control">
          <div class="em-proj-detail__switcher">
            <ul>
              <li @click="format">{{$t('p.detail.editor.control[0]')}}</li>
              <li @click="preview" v-if="isEdit">{{$t('p.detail.editor.control[1]')}}</li>
              <li @click="close">{{$t('p.detail.editor.control[2]')}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import './index.css';
</style>

<script>
import * as api from '../../api'
import jsBeautify from 'js-beautify/js/lib/beautify'
import collection from 'lodash/collection'
import array from 'lodash/array'
let ace

if (typeof window !== 'undefined') {
  ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  require('./snippets')
}

export default {
  name: 'editor',
  data () {
    return {
      codeEditor: null,
      autoClose: true,
      methods: [
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'DELETE', value: 'delete' },
        { label: 'PATCH', value: 'patch' }
      ],
      temp: {
        operationId: '',
        url: '',
        mode: '{"data": {}}',
        method: 'GET',
        description: '',
        parameters: []
      },
      params: true,
      showDesc: false,
      showOperationIdInput: false
    }
  },
  computed: {
    mockData () {
      return this.$store.state.mock.editorData.mock
    },
    baseUrl () {
      return this.$store.state.mock.editorData.baseUrl
    },
    projectId () {
      return this.$route.params.projectId
    },
    isEdit () {
      return !!this.$route.params.id && this.mockData
    },
    sortParameters: function () {
      let pathParams = collection.map(this.temp.url.match(/\/:[\w\d]+/g), name => {
        let searchResult = collection.filter(this.temp.parameters, {name: name.substring(2), in: 'path'})
        if (searchResult.length) {
          return searchResult[0]
        }
        return {
          name: name.substring(2),
          required: true,
          in: 'path',
          schema: {type: '', 'default': ''},
          description: ''
        }
      })

      let queries = collection.filter(this.temp.parameters, {in: 'query'})

      return array.concat(pathParams, queries).filter(function (param) {
        return param.in === 'path' || param.in === 'query' || param.in === undefined
      }).concat({name: '', schema: {type: '', 'default': ''}, description: '', last: true})
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.matched.length === 0) { // 防止编辑页刷新导致的显示异常（直接进入项目主页）
      return next({
        path: `/project/${to.params.projectId}`,
        replace: true
      })
    }
    next()
  },
  mounted () {
    this.codeEditor = ace.edit(this.$refs.codeEditor)
    this.codeEditor.getSession().setMode('ace/mode/javascript')
    this.codeEditor.setTheme('ace/theme/monokai')
    this.codeEditor.setOption('tabSize', 2)
    this.codeEditor.setOption('fontSize', 15)
    this.codeEditor.setOption('enableLiveAutocompletion', true)
    this.codeEditor.setOption('enableSnippets', true)
    this.codeEditor.clearSelection()
    this.codeEditor.getSession().setUseWorker(false)
    this.codeEditor.on('change', this.onChange)
    this.codeEditor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
      exec: () => {
        this.submit()
      }
    })

    if (this.isEdit) {
      this.autoClose = true
      this.temp.url = this.mockData.url.slice(1) // remove /
      this.temp.mode = this.mockData.mode
      this.temp.method = this.mockData.method
      this.temp.description = this.mockData.description
      this.temp.parameters = JSON.parse(this.mockData.parameters)
    }

    this.$nextTick(() => {
      this.codeEditor.setValue(this.temp.mode)
      this.codeEditor.setValue(this.temp.mode)
      this.format()
    })
  },
  methods: {
    convertUrl (url) {
      const newUrl = '/' + url
      return newUrl === '/'
        ? '/'
        : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
    },
    format () {
      const context = this.codeEditor.getValue()
      let code = /^http(s)?/.test(context)
        ? context
        : jsBeautify.js_beautify(context, { indent_size: 2 })
      this.codeEditor.setValue(code)
    },
    onChange () {
      this.temp.mode = this.codeEditor.getValue()
    },
    close () {
      this.$store.commit('mock/SET_EDITOR_DATA', {mock: null, baseUrl: ''})
      this.$router.replace(`/project/${this.projectId}`)
    },
    submit () {
      const mockUrl = this.convertUrl(this.temp.url)

      try {
        const value = (new Function(`return ${this.temp.mode}`))() // eslint-disable-line
        if (!value) {
          this.$Message.error(this.$t('p.detail.editor.submit.error[0]'))
          return
        } else if (typeof value !== 'object') {
          throw new Error()
        }
      } catch (error) {
        if (!/^http(s)?:\/\//.test(this.temp.mode)) {
          this.$Message.error(error.message || this.$t('p.detail.editor.submit.error[1]'))
          return
        }
      }

      if (this.isEdit) {
        api.mock.update({
          data: {
            ...this.temp,
            parameters: JSON.stringify(this.sortParameters),
            id: this.mockData._id,
            url: mockUrl
          }
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.editor.submit.updateSuccess'))
            if (this.autoClose) this.close()
          }
        })
      } else {
        api.mock.create({
          data: {
            ...this.temp,
            url: mockUrl,
            project_id: this.projectId,
            parameters: JSON.stringify(this.sortParameters)
          }
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.create.success'))
            this.close()
          }
        })
      }
    },
    preview () {
      window.open(this.baseUrl + this.mockData.url + '#!method=' + this.mockData.method)
    },
    showRemove (item) {
      return !(item.path === 'query' || item.last === true)
    },
    remove (index) {
      this.temp.parameters.splice(index, 1)
    },
    placeholder (item, pl) {
      return item.last ? pl : ''
    },
    addRow (item, key, e) {
      if (item.last) {
        let newRow = {
          name: '',
          required: true,
          in: 'query',
          schema: {type: '', 'default': ''},
          description: ''
        }

        let proChain = key.split('.')
        let target = newRow
        for (let i = 0; i < proChain.length - 1; i++) {
          target = target[proChain[i]]
        }
        target[key] = e.target.value

        this.temp.parameters.push(newRow)
      }
    },
    focusOperationIdInput () {
      this.showOperationIdInput = true
      this.$nextTick(() => {
        this.$refs.operationIdInput.focus()
      })
    }
  }
}
</script>
