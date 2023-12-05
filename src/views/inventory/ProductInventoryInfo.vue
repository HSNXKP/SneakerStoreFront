<template>
    <div>
        <el-card >
            <div style="display:flex;padding: 0 0 0 0;!important">
                <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
                        <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                                :src="product.image" />
                        </div>
                        <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                                :src="product.image" />
                        </div>
            </el-popover>
            <div style="font-size: 12px;color: #999;margin-left: 10px;">
                <div>
                    货号:<span style="font-size: 13px;color: rgb(0, 0, 0);">
                    <strong>
                        {{product.code}}
                    </strong>
                </span>
                </div>
                <div style="font-size: 12px;color: #999;">
                        {{product.name}}
                </div>
            </div>
            </div>
        </el-card>
          <el-table :data="productInventoryInfoList">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column label="id" prop="id" width="50"></el-table-column>
              <el-table-column label="规格" prop="name"  show-overflow-tooltip></el-table-column>
              <el-table-column label="上架价格" prop="productPrice" show-overflow-tooltip></el-table-column>
              <el-table-column label="数量" prop="productCount" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="200">
                <template slot="header" slot-scope="scope">
                    <el-button  type="primary" icon="el-icon-plus" @click="addProductInventory" size="mini">添加规格</el-button>
              </template>
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="goEditProductInventoryInfo(scope.row.id)">编辑</el-button>
                      <el-popconfirm title="确定下架吗？" icon="el-icon-delete" iconColor="red" @onConfirm="deleteProductInventory(scope.row.id)">
                          <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">下架</el-button>
                      </el-popconfirm>
                  </template>
              </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
                         :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
                         layout="total, sizes, prev, pager, next, jumper" background>
          </el-pagination>

          <!--添加标签对话框-->
		<el-dialog :title="this.visForm.id === '' ? '添加规格' : '修改规格信息'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancelVisble">
			<!--内容主体-->
			<el-form :model="visForm"  :rules="formRules" ref="visFormRef" label-width="80px">
				<el-form-item label="规格" prop="name">
					<el-input v-model="visForm.name"></el-input>
				</el-form-item>
                <el-form-item label="价格" prop="productPrice">
					<el-input v-model="visForm.productPrice"></el-input>
				</el-form-item>
                <el-form-item label="数量" prop="productCount">
					<el-input v-model="visForm.productCount"></el-input>
				</el-form-item>
			</el-form>
			<!--底部-->
			<span slot="footer">
				<el-button @click="cancelVisble">取 消</el-button>
				<el-button type="primary" @click="editProductInventoryInfo">确 定</el-button>
			</span>
		</el-dialog>
    </div>
  </template>
  
  <script>
      import {getProductInventoryInfoByProductId,addProductInventoryInfo,updateProductInventoryInfo,getProductInventory,deleteProductInventory} from '@/api/productInventory'
      import {getProduct} from '@/api/product'
      import {checkNumber} from "@/util/reg";

      export default {
          name: "ProductInventoryInfo",
          data() {
              return {
                  productInventoryInfoList:[],
                  total: 0,
                  dialogVisible: false,
                  visForm: {
                        id: '',
                        productId: '',
                        name: '',
                        productPrice: '',
                        productCount: '',
                  },
                  queryInfo: {
                      productId: '',
                      pageNum: 1,
                      pageSize: 10
                  },
                  formRules: {
                      name: [
                          {required: true, message: '请输入商品规格', trigger: 'blur'},
                      ],
                      productPrice: [
                          {required: true, message: '请输入规格价格', trigger: 'blur'},
                      ],
                      productCount: [
                          {required: true, message: '请输入规格数量', trigger: 'blur'},
                          {validator: checkNumber, trigger: 'blur'}
                      ],
                  },
                  product:{}
              }
          },
          computed: {
              productId() {
                return parseInt(this.$route.params.id)
              }
          },
          created() {
              this.getProductInventoryInfoByProductId()
                this.getProductInfoById()
          },
          methods: {
              getProductInventoryInfoByProductId() {
                  this.queryInfo.productId = this.productId
                  getProductInventoryInfoByProductId(this.queryInfo).then(res => {
                    this.productInventoryInfoList = res.data.list
                      this.total = res.data.total
                      console.log(this.productInventoryInfoList)
                  })
              },
              getProductInfoById() {
                const productId = this.productId
                getProduct(productId).then(res => {
                    this.product = res.data
                })
              },
              //监听 pageSize 改变事件
              handleSizeChange(newSize) {
                  this.queryInfo.pageSize = newSize
                  this.getProductInventoryInfoByProductId()
              },
              //监听页码改变的事件
              handleCurrentChange(newPage) {
                  this.queryInfo.pageNum = newPage
                  this.getProductInventoryInfoByProductId()
              },
              goEditProductInventoryInfo(id) {
                getProductInventory(id).then(res => {
                    this.visForm = res.data
                    this.dialogVisible = true
                })
              },
              editProductInventoryInfo() {
                if(this.visForm.id === ''){
                    this.$refs.visFormRef.validate((valid) => {
                      if (valid) {
                        this.visForm.productId = this.productId
                        addProductInventoryInfo(this.visForm).then(res => {
                              this.msgSuccess(res.msg)
                              this.cancelVisble()
                              this.getProductInventoryInfoByProductId()
                          })
                      } else {
                          this.msgError('表单验证失败')
                          return false
                      }
                  })
                }else{
                    this.$refs.visFormRef.validate((valid) => {
                      if (valid) {
                        updateProductInventoryInfo(this.visForm).then(res => {
                              this.msgSuccess(res.msg)
                              this.cancelVisble()
                              this.getProductInventoryInfoByProductId()
                          })
                      } else {
                          this.msgError('表单验证失败')
                          return false
                      }
                  })
                }
              },
              deleteProductInventory(id) {
                  this.$confirm('此操作将<strong style="color: red">下架该规格</strong>，是否下架?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      dangerouslyUseHTMLString: true
                  }).then(() => {
                    deleteProductInventory(id).then(res => {
                          this.msgSuccess(res.msg)
                          this.getProductInventoryInfoByProductId()
                      })
                  }).catch(() => {
                      this.$message({
                          type: 'info',
                          message: '已取消删除'
                      })
                  })
              },
              addProductInventory(){
                this.resetForm()
                this.dialogVisible = true
            },
              cancelVisble() {
                  this.dialogVisible = false
                  this.resetForm()
                  this.$refs.visFormRef.resetFields()
              },
             // 清空表单
			 resetForm() {
				this.visForm = {
                    id: '',
                    name: '',
                    productId: '',
                    productCount: '',
                    productPrice: '',
				}
			},
          }
      }
  </script>
  
  <style scoped>
    .el-button + span {
        margin-left: 10px;
    }
  
    .el-form--inline .el-form-item {
		margin-bottom: 0;
	}
    /deep/.el-card__body{
        padding: 10px 10px 10px 10px;
    }

  </style>