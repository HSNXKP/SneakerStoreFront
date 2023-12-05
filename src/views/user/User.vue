<template>
	<div>
		<!--搜索-->
		<el-row>
			<el-col :span="8">
				<el-input placeholder="请输入用户名或昵称" v-model="queryInfo.name" :clearable="true" @clear="search" @keyup.native.enter="search" size="small" style="min-width: 500px">
					<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
			</el-col>
		</el-row>
		<el-table :data="userList">
			<el-table-column label="序号" type="index" width="50"></el-table-column>
			<el-table-column label="id" prop="id" width="50"></el-table-column>
			<el-table-column label="用户名" prop="username"  width="150"></el-table-column>
            <el-table-column label="昵称" prop="nickname" show-overflow-tooltip></el-table-column>
            <el-table-column label="密码" prop="password" show-overflow-tooltip></el-table-column>
            <el-table-column label="头像" prop="avatar" show-overflow-tooltip></el-table-column>
			<el-table-column label="邮箱" prop="email" show-overflow-tooltip></el-table-column>
            <el-table-column label="个人签名" prop="userSign" show-overflow-tooltip></el-table-column>
            <el-table-column label="个性前戳" prop="userFlag" show-overflow-tooltip></el-table-column>
            <el-table-column label="前戳颜色" prop="flagColor" show-overflow-tooltip></el-table-column>
            <el-table-column label="关注" prop="follow" show-overflow-tooltip></el-table-column>
            <el-table-column label="粉丝" prop="fans" show-overflow-tooltip></el-table-column>
			<el-table-column label="创建时间" width="170">
				<template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
			</el-table-column>
			<el-table-column label="最近更新" width="170">
				<template v-slot="scope">{{ scope.row.updateTime | dateFormat }}</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template v-slot="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="goUserEditPage(scope.row.id)">编辑</el-button>
					<el-popconfirm title="确定删除吗？" icon="el-icon-delete" iconColor="red" @onConfirm="deleteUserById(scope.row.id)">
						<el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<!--分页-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
		               :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
		               layout="total, sizes, prev, pager, next, jumper" background>
		</el-pagination>
	</div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
    import {getAllUser,deleteUser} from '@/api/user'

	export default {
		name: "User",
		components: {Breadcrumb},
		data() {
			return {
				queryInfo: {
                    name:'',
					pageNum: 1,
					pageSize: 10
				},
				total: 0,
                userList: [],
			}
		},
		created() {
            this.getAllUser()
		},
		methods: {
            getAllUser() {
                getAllUser(this.queryInfo).then(res => {
                    if (res.code === 200) {
                        console.log(res.data)
                        this.userList = res.data.list
                        this.total = res.data.total
                    }
                })
            },
			search() {
				this.queryInfo.pageNum = 1
				this.queryInfo.pageSize = 10
				this.getAllUser()
			},
			//监听 pageSize 改变事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getAllUser()
			},
			//监听页码改变的事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNum = newPage
				this.getAllUser()
			},
            goUserEditPage(id) {
                this.$router.push(`/user/edit/${id}`)
            },
            deleteUserById(id) {
                this.$confirm('此操作将永久删除该用户<strong style="color: red">及其所有动态</strong>，是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    deleteUser(id).then(res => {
                        this.msgSuccess(res.msg)
                        this.getAllUser()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
		}
	}
</script>

<style scoped>
	.el-button + span {
		margin-left: 10px;
	}
</style>