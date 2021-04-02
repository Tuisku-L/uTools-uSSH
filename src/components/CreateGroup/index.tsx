import React, { useState } from "react";
import * as Services from "@/utils/uToolsDb";
import { Spin, Form, Input, Button, message } from "antd";
import { Group } from "@/@types/entities";


const createGroup = (props: { editGroup?: Group, onFinish?: Function }) => {
    const { editGroup } = props;
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (values: Group) => {
        values.createDate = Date.now();
        values.sort = Number(values.sort);
        if (isNaN(values.sort) || values.sort <= 0) {
            return message.warn("请输入大于零的正确排序数字");
        }
        if (editGroup) {
            values._rev = editGroup._rev;
            values._id = editGroup._id;
        } else {
            values._id = `group|${values.createDate}`;
        }
        const result = Services.createOrUpdateGroup(values);
        if (result) {
            message.success("操作成功");
        } else {
            message.error("操作失败");
        }
        props.onFinish && props.onFinish();
    }

    return <Spin spinning={isLoading}>
        <Form
            labelCol={{ span: 3 }}
            labelAlign="right"
            onFinish={onSubmit}
        >
            <Form.Item
                label="名称"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "请输入分组名称"
                    }
                ]}
                initialValue={editGroup ? editGroup.name : ""}
            >
                <Input placeholder="分组名称" />
            </Form.Item>
            <Form.Item
                label="密码"
                name="password"
                initialValue={editGroup ? editGroup.password : ""}
            >
                <Input.Password placeholder="分组查看密码，不输入则无密码" />
            </Form.Item>
            <Form.Item
                label="排序"
                name="sort"
                initialValue={editGroup ? editGroup.sort : 1}
            >
                <Input type="number" placeholder="分组排序" />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100px" }}
                >
                    {editGroup ? "确认修改" : "确认添加"}
                </Button>
            </Form.Item>
        </Form>
    </Spin>
};

export default createGroup;
