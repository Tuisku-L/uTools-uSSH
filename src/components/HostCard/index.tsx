import React, { useState } from "react";
import { Card } from "antd";
import { ApiOutlined, EditOutlined } from "@ant-design/icons"
import { Host } from "@/@types/entities";

const hostCard = (props: { host: Host }) => {
    return <Card
        actions={[
            <span><ApiOutlined />&nbsp;连接</span>,
            <span><EditOutlined />&nbsp;编辑</span>
        ]}
    >
        <div style={{ textAlign: "center" }}>
            {props.host.alias ?? props.host.address}
        </div>
    </Card>
}

export default hostCard;
