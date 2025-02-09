import React, {useEffect, useState} from 'react';
import {Card, Col, Row, Spin, Statistic} from 'antd';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';

interface BookStatistic {
    total: number;
    hidden: number;
    visible: number;
}

const Dashboard: React.FC = () => {
    const [statistic, setStatistic] = useState<BookStatistic>({total: 0, hidden: 0, visible: 0});
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const response = await fetch('/api/books/statistic');
            if (response.ok) {
                const data = await response.json().then(t => t.data);
                setStatistic(data);
            } else {
                console.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks().then();
    }, []);

    const totalBooks = statistic.total;
    const hiddenBooks = statistic.hidden;
    const visibleBooks = statistic.visible

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Dashboard</h2>
            {loading ? (
                <Spin size="large"/>
            ) : (
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Total Books"
                                value={totalBooks}
                                valueStyle={{color: '#3f8600'}}
                                prefix={<ArrowUpOutlined/>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Visible Books"
                                value={visibleBooks}
                                valueStyle={{color: '#3f8600'}}
                                prefix={<ArrowUpOutlined/>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Hidden Books"
                                value={hiddenBooks}
                                valueStyle={{color: '#cf1322'}}
                                prefix={<ArrowDownOutlined/>}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Dashboard;
